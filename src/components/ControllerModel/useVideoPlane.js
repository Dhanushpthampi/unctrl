import { useEffect, useRef } from "react";
import * as THREE from "three";

const textureCache = new Map();
const loader = new THREE.TextureLoader();
const bitmapLoader = new THREE.ImageBitmapLoader();
bitmapLoader.setOptions({ imageOrientation: "flipY", premultiplyAlpha: "none" });

const buildPaths = (idx) => [`/assets/usps/${idx}.png`];

// Generic texture loader with off-thread decode when possible
const tryLoadInOrder = (paths, onSuccess, onFail) => {
  let i = 0;
  const attempt = () => {
    if (i >= paths.length) {
      onFail?.();
      return;
    }
    const path = paths[i++];
    
    // Check for ImageBitmap support (not available in Safari)
    if (typeof createImageBitmap !== "undefined" && typeof ImageBitmap !== "undefined") {
      bitmapLoader.load(
        path,
        (imageBitmap) => onSuccess(new THREE.CanvasTexture(imageBitmap)),
        undefined,
        () => loader.load(path, onSuccess, undefined, attempt)
      );
    } else {
      // Fallback to regular texture loader for Safari and other browsers
      loader.load(path, onSuccess, undefined, attempt);
    }
  };
  attempt();
};

export default function useVideoPlane({ nodes, scene, videoIndex, videoRef, planeRef, invalidate }) {
  const currentLoadRequestIdRef = useRef(0);

  // Create plane once
  useEffect(() => {
    if (!nodes?.Object_55 || !scene) return;

    const mesh = nodes.Object_55;
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const aspect = 16 / 9;
    let planeWidth = size.x * 0.9;
    let planeHeight = planeWidth / aspect;
    if (planeHeight > size.y * 0.9) {
      planeHeight = size.y * 0.9;
      planeWidth = planeHeight * aspect;
    }

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.copy(center);
    plane.position.y -= size.y * 0.72;
    plane.position.z -= size.z * 1.1;
    plane.rotation.set(-Math.PI / 2, 0, 0);
    planeRef.current = plane;
    mesh.parent.add(plane);

    // Preload common textures (1–5)
    for (let idx = 1; idx <= 5; idx++) {
      if (!textureCache.has(idx)) {
        tryLoadInOrder(buildPaths(idx), (tex) => textureCache.set(idx, tex));
      }
    }

    // Clean up on unmount
    return () => {
      if (material.map && ![...textureCache.values()].includes(material.map)) {
        material.map.dispose();
      }
      geometry.dispose();
      material.dispose();
      plane.removeFromParent();
    };
  }, [nodes?.Object_55, scene]);

  // Load or switch texture when videoIndex changes
  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;

    const material = plane.material;
    const oldMap = material.map;

    const setMaterialMap = (texture) => {
      texture.flipY = true;
      texture.encoding = THREE.LinearSRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      material.map = texture;
      material.needsUpdate = true;
      invalidate?.();
    };

    const cached = textureCache.get(videoIndex);
    if (cached) {
      setMaterialMap(cached);
      if (oldMap && oldMap !== cached && ![...textureCache.values()].includes(oldMap)) oldMap.dispose();
      return;
    }

    const requestId = ++currentLoadRequestIdRef.current;
    tryLoadInOrder(buildPaths(videoIndex), (texture) => {
      if (requestId !== currentLoadRequestIdRef.current) {
        texture.dispose?.();
        return;
      }
      textureCache.set(videoIndex, texture);
      setMaterialMap(texture);
      if (oldMap && oldMap !== texture && ![...textureCache.values()].includes(oldMap)) oldMap.dispose();
    });
  }, [videoIndex]);
}
