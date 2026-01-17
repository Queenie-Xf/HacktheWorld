import React, { useEffect, useRef } from 'react';

interface LandingViewProps {
  onStart: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const THREE = (window as any).THREE;
    if (!THREE) {
      console.error('Three.js not loaded');
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050a, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 4000;

    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color('#F472B6'),
      new THREE.Color('#38BDF8'),
      new THREE.Color('#A855F7'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 150;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 150;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const getTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      map: getTexture(),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      const targetX = mouseX * 5;
      const targetY = mouseY * 5;

      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden bg-space-950">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 bg-space-950/40 z-0 pointer-events-none radial-gradient-overlay"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-lg w-full text-center p-6 animate-fade-in -mt-20">
        <div className="w-32 h-32 relative animate-float group cursor-pointer">
          <div className="absolute inset-0 bg-nebula-pink/20 blur-[40px] rounded-full group-hover:bg-nebula-pink/30 transition-all duration-700"></div>

          <div className="w-full h-full rounded-full border border-white/10 bg-space-900/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.1)]">
            <div className="absolute inset-0 overflow-hidden opacity-50">
              <svg className="w-full h-full absolute inset-0">
                <defs>
                  <linearGradient id="speedLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[...Array(5)].map((_, i) => (
                  <rect
                    key={i}
                    x="-100"
                    y={Math.random() * 200}
                    width={Math.random() * 80 + 20}
                    height="1"
                    fill="url(#speedLineGrad)"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="x"
                      from="200"
                      to="-100"
                      dur={`${Math.random() * 1 + 0.5}s`}
                      repeatCount="indefinite"
                      begin={`${Math.random()}s`}
                    />
                  </rect>
                ))}
              </svg>
            </div>

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
              <defs>
                <filter id="pinkGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g
                transform="translate(48, 45)"
                stroke="#F472B6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pinkGlow)"
              >
                <circle cx="50" cy="30" r="12" fill="#05050A" />

                <path d="M50 42 L 55 80" />

                <path d="M55 80 L 80 70 L 85 95">
                  <animate
                    attributeName="d"
                    values="
                            M55 80 L 80 70 L 85 95; 
                            M55 80 L 75 90 L 65 110; 
                            M55 80 L 40 90 L 25 80; 
                            M55 80 L 60 70 L 70 60; 
                            M55 80 L 80 70 L 85 95"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>

                <path d="M55 80 L 30 90 L 20 80">
                  <animate
                    attributeName="d"
                    values="
                            M55 80 L 30 90 L 20 80; 
                            M55 80 L 40 70 L 50 60; 
                            M55 80 L 80 70 L 85 95; 
                            M55 80 L 75 90 L 65 110; 
                            M55 80 L 30 90 L 20 80"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>

                <path d="M52 50 L 75 45 L 85 35">
                  <animate
                    attributeName="d"
                    values="
                            M52 50 L 75 45 L 85 35; 
                            M52 50 L 60 60 L 55 75; 
                            M52 50 L 30 60 L 25 50; 
                            M52 50 L 40 45 L 35 35; 
                            M52 50 L 75 45 L 85 35"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>

                <path d="M52 50 L 30 60 L 25 50">
                  <animate
                    attributeName="d"
                    values="
                            M52 50 L 30 60 L 25 50; 
                            M52 50 L 40 45 L 35 35; 
                            M52 50 L 75 45 L 85 35; 
                            M52 50 L 60 60 L 55 75; 
                            M52 50 L 30 60 L 25 50"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              <line
                x1="20"
                y1="160"
                x2="180"
                y2="160"
                stroke="#F472B6"
                strokeWidth="1"
                strokeDasharray="10 30"
                opacity="0.3"
              >
                <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.5s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            On Her Way
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>

          <p className="text-blue-100/90 text-sm md:text-base font-light tracking-[0.05em] max-w-xs md:max-w-md mx-auto">
            AI 驱动的女性职业生涯“第一步”行动社区
          </p>
        </div>

        <div className="pt-6">
          <button onClick={onStart} className="group relative px-10 py-3.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-purple/30 to-nebula-pink/30 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>

            <span className="relative flex items-center gap-3 text-white text-xs md:text-sm font-bold tracking-widest uppercase">
              开始探索
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[9px] text-white/20 tracking-widest z-10">DESIGNED FOR 我们</div>
    </div>
  );
};

