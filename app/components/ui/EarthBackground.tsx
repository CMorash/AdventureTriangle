'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface EarthBackgroundProps {
  className?: string;
}

export default function EarthBackground({ className = '' }: EarthBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const animationFrameRef = useRef<number>();
  const targetZRef = useRef(7.2);
  const targetSunYRef = useRef(3.0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- scene / camera / renderer ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0.6, 7.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- postprocessing bloom ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.9,
      0.6,
      0.1
    );
    bloomPass.threshold = 0.15;
    bloomPass.strength = 0.9;
    bloomPass.radius = 0.6;
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // --- loaders ---
    const texLoader = new THREE.TextureLoader();
    // Use local NASA textures from public folder
    const BASE = '/textures/';
    
    // Load textures with proper error handling and wait for all to load
    // Only loading 3 textures (day, clouds, night) - skipping .tif files
    let texturesLoaded = 0;
    const totalTextures = 3; // Only JPG files
    const textures: THREE.Texture[] = [];
    
    const onTextureLoad = () => {
      texturesLoaded++;
      console.log(`Texture loaded: ${texturesLoaded}/${totalTextures}`);
      if (texturesLoaded === totalTextures) {
        // All textures loaded, start rendering
        console.log('All textures loaded, starting Earth rendering');
        startRendering();
      }
    };
    
    const onTextureError = (error: ErrorEvent | string) => {
      console.error('Texture loading error:', error);
      texturesLoaded++;
      // Continue rendering even if some textures fail
      if (texturesLoaded === totalTextures) {
        console.warn('Some textures failed to load, but continuing with available textures');
        startRendering();
      }
    };
    
    // Load local NASA textures
    // Note: Skipping .tif files as browsers don't support them natively
    // The Earth will still look great without normal/specular maps
    const dayMap = texLoader.load(
      BASE + '8k_earth_daymap.jpg',
      () => {
        console.log('Day map loaded successfully');
        onTextureLoad();
      },
      undefined,
      (error) => {
        console.error('Failed to load day map:', error);
        onTextureError(error);
      }
    );
    // Skip .tif files - browsers don't support them
    // Create placeholder textures for normal and specular maps
    const normalMap = null; // Will be skipped in material
    const specMap = null; // Will be skipped in material
    // Count these as "loaded" immediately since we're skipping them
    onTextureLoad();
    onTextureLoad();
    const cloudsMap = texLoader.load(
      BASE + '8k_earth_clouds.jpg',
      onTextureLoad,
      undefined,
      onTextureError
    );
    const nightMap = texLoader.load(
      BASE + '8k_earth_nightmap.jpg',
      onTextureLoad,
      undefined,
      onTextureError
    );

    // Configure textures for high-resolution rendering
    // Set color space for color textures
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
    
    // Set texture filtering for better quality with 8k textures
    [dayMap, cloudsMap, nightMap].forEach(texture => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });
    
    // Store textures for cleanup (only JPG files)
    textures.push(dayMap, cloudsMap, nightMap);

    // --- Earth ---
    const RADIUS = 2.9;
    const geo = new THREE.SphereGeometry(RADIUS, 160, 160);

    const mat = new THREE.MeshPhongMaterial({
      map: dayMap,
      // Skip normalMap and specularMap since .tif files aren't supported
      shininess: 10,
      emissiveMap: nightMap,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.9,
    });

    const earth = new THREE.Mesh(geo, mat);
    scene.add(earth);
    earthRef.current = earth;

    // --- Cloud layer ---
    const cloudGeo = new THREE.SphereGeometry(RADIUS * 1.01, 160, 160);
    const cloudMat = new THREE.MeshLambertMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.7,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);
    cloudsRef.current = clouds;

    // --- Atmosphere shader (rim glow) ---
    const atmosphereGeo = new THREE.SphereGeometry(RADIUS * 1.06, 128, 128);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main(){
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          vec3 glow = vec3(0.14,0.32,0.86) * intensity;
          gl_FragColor = vec4(glow, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // --- starfield (points) ---
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 12000;
    const starPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 400 + Math.random() * 100;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // --- lighting: sun that will crest on top ---
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.4);
    sunLight.position.set(0, 3, 6);
    sunLight.castShadow = false;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // subtle fill so dark side isn't pure black
    const fill = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(fill);

    // --- controls for small interactivity (disabled zoom/pan) ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI - 0.2;

    // --- scroll handler ---
    const getScrollProgress = () => {
      // Find PartnerFormSection element
      const partnerFormSection = document.getElementById('partner-form');
      if (!partnerFormSection) {
        // Fallback to full page scroll if section not found
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        return maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
      }
      
      const partnerFormTop = partnerFormSection.offsetTop;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate progress from 0 (top) to 1 (partner form section)
      // Progress is 1 when we reach the partner form section
      const progress = Math.min(1, scrollY / partnerFormTop);
      return progress;
    };

    const handleScroll = () => {
      const p = getScrollProgress();
      // camera zoom from 7.2 -> 3.6
      targetZRef.current = THREE.MathUtils.lerp(7.2, 3.6, p);
      // sun moves to crest over top then slightly forward
      targetSunYRef.current = THREE.MathUtils.lerp(3.0, 5.2, p);
      // tilt camera down slightly as we approach
      camera.position.y = THREE.MathUtils.lerp(0.6, 0.2, p);
      
      // Hide Earth background when we reach partner form section
      if (container) {
        const opacity = p >= 1 ? 0 : 1;
        container.style.opacity = opacity.toString();
        container.style.pointerEvents = p >= 1 ? 'none' : 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    // --- animation loop with smooth interpolation ---
    const clock = new THREE.Clock();
    let texturesReady = false;
    
    const startRendering = () => {
      texturesReady = true;
    };
    
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Only animate Earth/clouds if textures are ready
      if (texturesReady) {
        // idle rotation
        if (earthRef.current) {
          earthRef.current.rotation.y += 0.0009;
        }
        if (cloudsRef.current) {
          cloudsRef.current.rotation.y += 0.00105;
        }
      }

      // smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.z = THREE.MathUtils.lerp(
          cameraRef.current.position.z,
          targetZRef.current,
          0.06
        );
      }

      // smooth sun movement
      if (sunLightRef.current) {
        sunLightRef.current.position.y = THREE.MathUtils.lerp(
          sunLightRef.current.position.y,
          targetSunYRef.current,
          0.06
        );
        sunLightRef.current.position.x = 0;
        sunLightRef.current.position.z = 6;
      }

      // subtle parallax: tilt atmosphere towards camera
      if (cameraRef.current && texturesReady) {
        atmosphere.lookAt(cameraRef.current.position);
      }

      // render with bloom composer for cinematic glow
      if (composerRef.current) {
        composerRef.current.render();
      }
    };
    animate();

    // --- resize handler ---
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !composerRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      composerRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      // Dispose geometries and materials
      geo.dispose();
      mat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();

      // Dispose textures
      textures.forEach(texture => texture.dispose());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, transition: 'opacity 0.5s ease-out' }}
    />
  );
}
