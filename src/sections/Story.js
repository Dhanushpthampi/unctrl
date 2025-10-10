"use client";


export default function Story() {
  return (
    <section
      id="story"
      className="relative w-screen max-w-[100vw] min-h-[100svh] bg-black overflow-hidden flex items-center justify-center"
      style={{ margin: 0, padding: 0 }}
    >
 {/* Desktop video */}
      <video
        className="w-full max-w-[100vw] h-auto hidden md:block"
        autoPlay
        loop
        muted
        playsInline
        preload="lazy"
      >
        <source src="/assets/videos/rage-story.mp4" type="video/mp4" />
      </video>
      {/* Mobile video */}
      <video
        className="w-full max-w-[100vw] h-auto block md:hidden"
        autoPlay
        loop
        muted
        playsInline
        preload="lazy"
      >
        <source src="/assets/videos/s2.mp4" type="video/mp4" />
      </video>
      
    </section>
  );
}


// // "use client";

// export default function Story() {
//   return (
//     <section
//       id="story"
//       className="relative w-screen min-h-[100svh] bg-black overflow-hidden flex items-center justify-center"
//       style={{ margin: 0, padding: 0 }}
//     >
//       {/* Desktop video (cropped top) */}
//       <div className="hidden md:block relative w-full h-[100vh] overflow-hidden">
//         <video
//           className="absolute top-[-80px] left-0 w-full h-[calc(100vh+80px)] object-cover"
//           autoPlay
//           loop
//           muted
//           playsInline
//           preload="metadata"
//         >
//           <source src="/assets/videos/rage-story.mp4" type="video/mp4" />
//         </video>
//       </div>

//       {/* Mobile video (normal) */}
//       <video
//         className="w-full h-auto block md:hidden"
//         autoPlay
//         loop
//         muted
//         playsInline
//         preload="metadata"
//       >
//         <source src="/assets/videos/s2.mp4" type="video/mp4" />
//       </video>
//     </section>
//   );
// }
// // 