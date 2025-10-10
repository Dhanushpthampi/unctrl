import { useEffect, useRef } from "react";
import * as THREE from "three";

const textureCache = new Map();

export default function useVideoPlane({ nodes, scene, videoIndex, videoRef, planeRef, invalidate }) {
  const currentLoadRequestIdRef = useRef(0);
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

    // helpers
    const loader = new THREE.TextureLoader();
    const bitmapLoader = new THREE.ImageBitmapLoader();
    bitmapLoader.setOptions({ imageOrientation: "flipY", premultiplyAlpha: "none" });
    const tryLoadInOrder = (paths, onSuccess, onFail) => {
      let index = 0;
      const attempt = () => {
        if (index >= paths.length) {
          onFail && onFail();
          return;
        }
        const path = paths[index++];
        // Prefer off-main-thread decode
        if (typeof createImageBitmap !== "undefined") {
          bitmapLoader.load(
            path,
            (imageBitmap) => {
              const tex = new THREE.CanvasTexture(imageBitmap);
              onSuccess(tex);
            },
            undefined,
            () => {
              // fallback to TextureLoader on failure
              loader.load(path, (tex) => onSuccess(tex), undefined, () => attempt());
            }
          );
        } else {
          loader.load(path, (tex) => onSuccess(tex), undefined, () => attempt());
        }
      };
      attempt();
    };

    const buildPaths = (idx) => [
      `/assets/usps/${idx}.png`,
      `/assets/usps/${idx}.webp`,
    ];

    const setMaterialMap = (texture) => {
      texture.flipY = true;
      texture.encoding = THREE.LinearSRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      material.map = texture;
      material.needsUpdate = true;
      // Ensure a frame renders after swap
      invalidate?.();
    };

    // preload the small known set of textures once (1..5)
    for (let idx = 1; idx <= 5; idx++) {
      if (textureCache.has(idx)) continue;
      tryLoadInOrder(buildPaths(idx), (texture) => {
        textureCache.set(idx, texture);
      });
    }

    // initial image texture load
    const cached = textureCache.get(videoIndex);
    if (cached) setMaterialMap(cached);
    else {
      const requestId = ++currentLoadRequestIdRef.current;
      tryLoadInOrder(buildPaths(videoIndex), (texture) => {
        // Only apply if this is still the latest request
        if (requestId === currentLoadRequestIdRef.current) {
          textureCache.set(videoIndex, texture);
          setMaterialMap(texture);
        } else {
          // not latest, dispose to avoid leaks
          texture.dispose?.();
        }
      });
    }

    return () => {
      if (material.map) {
        material.map.dispose();
      }
      plane.removeFromParent();
      geometry.dispose();
      material.dispose();
    };
  }, [nodes?.Object_55, scene]);

  // image change (without re-creating plane)
  useEffect(() => {
    if (!planeRef.current) return;
    const material = planeRef.current.material;
    const loader = new THREE.TextureLoader();
    const bitmapLoader = new THREE.ImageBitmapLoader();
    bitmapLoader.setOptions({ imageOrientation: "flipY", premultiplyAlpha: "none" });

    const tryLoadInOrder = (paths, onSuccess, onFail) => {
      let index = 0;
      const attempt = () => {
        if (index >= paths.length) {
          onFail && onFail();
          return;
        }
        const path = paths[index++];
        if (typeof createImageBitmap !== "undefined") {
          bitmapLoader.load(
            path,
            (imageBitmap) => {
              const tex = new THREE.CanvasTexture(imageBitmap);
              onSuccess(tex);
            },
            undefined,
            () => loader.load(path, (tex) => onSuccess(tex), undefined, () => attempt())
          );
        } else {
          loader.load(path, (tex) => onSuccess(tex), undefined, () => attempt());
        }
      };
      attempt();
    };

    const buildPaths = (idx) => [
      `/assets/usps/${idx}.png`,
      `/assets/usps/${idx}.webp`,
      `/assets/usps/${idx}.jpg`,
      `/assets/usps/${idx}.jpeg`,
    ];

    const setMaterialMap = (texture) => {
      texture.flipY = true;
      texture.encoding = THREE.LinearSRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      material.map = texture;
      material.needsUpdate = true;
      invalidate?.();
    };

    const oldMap = material.map;
    const cached = textureCache.get(videoIndex);
    if (cached) {
      setMaterialMap(cached);
      if (oldMap && oldMap !== cached && ![...textureCache.values()].includes(oldMap)) oldMap.dispose();
      return;
    }

    const requestId = ++currentLoadRequestIdRef.current;
    tryLoadInOrder(buildPaths(videoIndex), (texture) => {
      // Only apply if latest request
      if (requestId === currentLoadRequestIdRef.current) {
        textureCache.set(videoIndex, texture);
        setMaterialMap(texture);
        if (oldMap && oldMap !== texture && ![...textureCache.values()].includes(oldMap)) oldMap.dispose();
      } else {
        texture.dispose?.();
      }
    });
  }, [videoIndex]);
}
