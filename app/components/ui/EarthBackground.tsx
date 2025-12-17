'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useEarthMode } from '@/app/contexts/EarthModeContext';

interface EarthBackgroundProps {
  className?: string;
}

export default function EarthBackground({ className = '' }: EarthBackgroundProps) {
  const { isDarkMode } = useTheme();
  const { isEarthMode } = useEarthMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const controlsRef = useRef<OrbitControls | null>(null);
  const targetZRef = useRef(7.2);
  const targetSunYRef = useRef(3.0);
  // Camera positions for each mode
  const textModeCameraPositionRef = useRef({ x: 0, y: -4.2, z: 7.2 });
  const earthModeCameraPositionRef = useRef({ x: 0, y: 0, z: 7.2 });
  // Track camera transition state
  const isCameraTransitioningRef = useRef(false);
  const cameraTransitionTargetRef = useRef({ x: 0, y: -4.2, z: 7.2 });
  const previousEarthModeRef = useRef<boolean | null>(null);
  const isEarthModeRef = useRef(false); // For use in scroll handler
  const dayMapRef = useRef<THREE.Texture | null>(null);
  const nightMapRef = useRef<THREE.Texture | null>(null);
  const cloudMatRef = useRef<THREE.MeshLambertMaterial | null>(null);
  const transitionStartTimeRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const previousDarkModeRef = useRef<boolean | null>(null);
  const currentBlendFactorRef = useRef(isDarkMode ? 1.0 : 0.0); // Track current blend state
  const targetDarkModeRef = useRef(isDarkMode); // Track target dark mode state for animation loop
  
  // Track current and target values for smooth transitions
  const currentCloudOpacityRef = useRef(isDarkMode ? 0.15 : 0.7);
  const currentBloomThresholdRef = useRef(isDarkMode ? 0.15 : 0.35);
  const currentBloomStrengthRef = useRef(isDarkMode ? 0.9 : 0.45);
  const currentBloomRadiusRef = useRef(isDarkMode ? 0.6 : 0.4);
  
  // Store initial values for interpolation
  const startCloudOpacityRef = useRef(isDarkMode ? 0.15 : 0.7);
  const startBloomThresholdRef = useRef(isDarkMode ? 0.15 : 0.35);
  const startBloomStrengthRef = useRef(isDarkMode ? 0.9 : 0.45);
  const startBloomRadiusRef = useRef(isDarkMode ? 0.6 : 0.4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- scene / camera / renderer ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    // Initial position for text mode (slightly above center, looking at Earth)
    camera.position.set(0, -4.2, 7.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
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
    // Adjust bloom based on dark mode - gentle bloom in light mode, more in dark mode
    // Use targetDarkModeRef to ensure correct initial state even if theme changed before textures loaded
    const initialBloomThreshold = targetDarkModeRef.current ? 0.15 : 0.35; // Higher threshold = less bloom
    const initialBloomStrength = targetDarkModeRef.current ? 0.9 : 0.45; // Gentle but visible bloom in light mode
    const initialBloomRadius = targetDarkModeRef.current ? 0.6 : 0.4; // Moderate radius in light mode
    bloomPass.threshold = initialBloomThreshold;
    bloomPass.strength = initialBloomStrength;
    bloomPass.radius = initialBloomRadius;
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
    
    const onTextureError = (error: unknown) => {
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
      (error: unknown) => {
        console.error('Failed to load day map:', error);
        onTextureError(error as ErrorEvent | string);
      }
    );
    dayMapRef.current = dayMap;
    
    // Skip .tif files - browsers don't support them
    // Create placeholder textures for normal and specular maps
    // Count these as "loaded" immediately since we're skipping them
    onTextureLoad();
    onTextureLoad();
    const cloudsMap = texLoader.load(
      BASE + '8k_earth_clouds.jpg',
      onTextureLoad,
      undefined,
      (error: unknown) => onTextureError(error)
    );
    const nightMap = texLoader.load(
      BASE + '8k_earth_nightmap.jpg',
      onTextureLoad,
      undefined,
      (error: unknown) => onTextureError(error)
    );
    nightMapRef.current = nightMap;

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

    // Create a shader material that can blend between day and night textures
    // Use targetDarkModeRef to ensure correct initial state even if theme changed before textures loaded
    const initialBlend = targetDarkModeRef.current ? 1.0 : 0.0;
    const earthShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        blendFactor: { value: initialBlend }, // 0 = day, 1 = night
        emissiveIntensity: { value: initialBlend * 0.05 }, // Very subtle city light glow
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform float blendFactor;
        uniform float emissiveIntensity;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);
          
          // Blend between day and night textures
          // blendFactor: 0.0 = day, 1.0 = night
          vec4 blendedColor = mix(dayColor, nightColor, blendFactor);
          
          // Add very subtle emissive glow for night mode city lights only
          // The night map should be darker than day map - keep emissive minimal
          vec3 emissive = vec3(0.0);
          if (blendFactor > 0.01) {
            // Extract only the brightest parts (city lights) from night texture
            float brightness = dot(nightColor.rgb, vec3(0.299, 0.587, 0.114));
            // Only apply emissive to very bright areas (city lights) - use higher threshold
            float lightMask = smoothstep(0.4, 0.7, brightness);
            vec3 cityLights = nightColor.rgb * lightMask;
            // Very subtle emissive - only enhance brightest city lights
            // Multiply by blendFactor to ensure it fades during transition
            emissive = cityLights * emissiveIntensity * blendFactor * 0.5;
          }
          
          // Final color: base texture (night map should be darker) + very subtle city light glow
          // The night map texture itself should be the main visual, emissive is just accent
          gl_FragColor = vec4(blendedColor.rgb + emissive, blendedColor.a);
        }
      `,
    });

    const earth = new THREE.Mesh(geo, earthShaderMaterial);
    scene.add(earth);
    earthRef.current = earth;

    // --- Cloud layer ---
    const cloudGeo = new THREE.SphereGeometry(RADIUS * 1.01, 160, 160);
    // Use targetDarkModeRef to ensure correct initial state even if theme changed before textures loaded
    const initialCloudOpacity = targetDarkModeRef.current ? 0.15 : 0.7;
    const cloudMat = new THREE.MeshLambertMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: initialCloudOpacity, // Much less visible in dark mode
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });
    cloudMatRef.current = cloudMat;
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);
    cloudsRef.current = clouds;

    // --- Atmosphere shader (rim glow) ---
    const atmosphereGeo = new THREE.SphereGeometry(RADIUS * 1.02, 128, 128);
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

    // --- controls for "Google Earth" style interaction ---
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // Set target to center of Earth - camera will always orbit around this point
    controls.target.set(0, 0, 0);
    
    // Enable zoom with scroll wheel / pinch only
    controls.enableZoom = true;
    controls.minDistance = 4;   // Closest zoom (can't go inside the Earth)
    controls.maxDistance = 20;  // Furthest zoom
    controls.zoomSpeed = 0.8;   // Zoom speed
    
    // Disable panning - Earth stays centered
    controls.enablePan = false;
    
    // Enable full 360° rotation (no polar angle limits)
    controls.enableRotate = true;
    controls.rotateSpeed = 0.8; // Rotation speed
    // No minPolarAngle/maxPolarAngle = full rotation freedom
    
    // Enable damping for smooth, natural feel (reduces momentum)
    controls.enableDamping = true;
    controls.dampingFactor = 0.08; // Smooth stopping
    
    // Disabled by default (text mode)
    controls.enabled = false;
    controlsRef.current = controls;

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
      
      // Calculate progress from 0 (top) to 1 (partner form section)
      // Progress is 1 when we reach the partner form section
      const progress = Math.min(1, scrollY / partnerFormTop);
      return progress;
    };

    const handleScroll = () => {
      // Don't modify camera during earth mode - user has full control
      if (isEarthModeRef.current) return;
      
      const p = getScrollProgress();
      // camera zoom from 7.2 -> 3.6 (original behavior)
      targetZRef.current = THREE.MathUtils.lerp(7.2, 3.6, p);
      // sun moves to crest over top then slightly forward
      targetSunYRef.current = THREE.MathUtils.lerp(3.0, 5.2, p);
      // tilt camera down slightly as we approach (original behavior: 0.6 -> 0.2)
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
      clock.getDelta();

      // Only animate Earth/clouds if textures are ready
      if (texturesReady) {
        // idle rotation
        if (earthRef.current) {
          earthRef.current.rotation.y += 0.0001;
        }
        if (cloudsRef.current) {
          cloudsRef.current.rotation.y += 0.00015;
        }
        
        // Handle smooth texture transition
        if (isTransitioningRef.current && earthRef.current) {
          const elapsed = (Date.now() - transitionStartTimeRef.current) / 1000; // seconds
          const duration = 5.0; // 5 seconds
          
          const mat = earthRef.current.material as THREE.ShaderMaterial;
          if (mat.uniforms) {
            const targetBlend = targetDarkModeRef.current ? 1.0 : 0.0; // Target: 1.0 for dark (night), 0.0 for light (day)
            const startBlend = currentBlendFactorRef.current; // Start from current blend state
            
            if (elapsed < duration) {
              // Smooth transition using easeInOutCubic
              const t = elapsed / duration;
              const easeT = t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
              
              // Interpolate earth texture blend
              const currentBlend = startBlend + (targetBlend - startBlend) * easeT;
              currentBlendFactorRef.current = currentBlend;
              mat.uniforms.blendFactor.value = currentBlend;
              mat.uniforms.emissiveIntensity.value = currentBlend * 0.1; // Very subtle emissive for city lights
              
              // Interpolate cloud opacity: 0.7 (light) -> 0.15 (dark)
              const targetCloudOpacity = targetDarkModeRef.current ? 0.15 : 0.7;
              const currentCloudOpacity = startCloudOpacityRef.current + (targetCloudOpacity - startCloudOpacityRef.current) * easeT;
              currentCloudOpacityRef.current = currentCloudOpacity;
              if (cloudMatRef.current) {
                cloudMatRef.current.opacity = currentCloudOpacity;
                cloudMatRef.current.needsUpdate = true;
              }
              
              // Interpolate bloom settings
              const targetBloomThreshold = targetDarkModeRef.current ? 0.15 : 0.35;
              const targetBloomStrength = targetDarkModeRef.current ? 0.9 : 0.45;
              const targetBloomRadius = targetDarkModeRef.current ? 0.6 : 0.4;
              
              const currentBloomThreshold = startBloomThresholdRef.current + (targetBloomThreshold - startBloomThresholdRef.current) * easeT;
              const currentBloomStrength = startBloomStrengthRef.current + (targetBloomStrength - startBloomStrengthRef.current) * easeT;
              const currentBloomRadius = startBloomRadiusRef.current + (targetBloomRadius - startBloomRadiusRef.current) * easeT;
              
              currentBloomThresholdRef.current = currentBloomThreshold;
              currentBloomStrengthRef.current = currentBloomStrength;
              currentBloomRadiusRef.current = currentBloomRadius;
              
              // Update bloom pass
              if (composerRef.current) {
                const bloomPass = composerRef.current.passes.find(
                  (pass: unknown) => pass instanceof UnrealBloomPass
                ) as UnrealBloomPass | undefined;
                
                if (bloomPass) {
                  bloomPass.threshold = currentBloomThreshold;
                  bloomPass.strength = currentBloomStrength;
                  bloomPass.radius = currentBloomRadius;
                }
              }
            } else {
              // Transition complete - set final values and stop transitioning
              currentBlendFactorRef.current = targetBlend;
              mat.uniforms.blendFactor.value = targetBlend;
              mat.uniforms.emissiveIntensity.value = targetBlend * 0.1; // Very subtle emissive for city lights
              
              const targetCloudOpacity = targetDarkModeRef.current ? 0.15 : 0.7;
              currentCloudOpacityRef.current = targetCloudOpacity;
              if (cloudMatRef.current) {
                cloudMatRef.current.opacity = targetCloudOpacity;
                cloudMatRef.current.needsUpdate = true;
              }
              
              const targetBloomThreshold = targetDarkModeRef.current ? 0.15 : 0.35;
              const targetBloomStrength = targetDarkModeRef.current ? 0.9 : 0.45;
              const targetBloomRadius = targetDarkModeRef.current ? 0.6 : 0.4;
              
              currentBloomThresholdRef.current = targetBloomThreshold;
              currentBloomStrengthRef.current = targetBloomStrength;
              currentBloomRadiusRef.current = targetBloomRadius;
              
              if (composerRef.current) {
                const bloomPass = composerRef.current.passes.find(
                  (pass: unknown) => pass instanceof UnrealBloomPass
                ) as UnrealBloomPass | undefined;
                
                if (bloomPass) {
                  bloomPass.threshold = targetBloomThreshold;
                  bloomPass.strength = targetBloomStrength;
                  bloomPass.radius = targetBloomRadius;
                }
              }
              
              isTransitioningRef.current = false;
            }
          }
        } else if (!isTransitioningRef.current && earthRef.current) {
          // When not transitioning, ensure values match the current mode
          const mat = earthRef.current.material as THREE.ShaderMaterial;
          if (mat.uniforms) {
            const targetBlend = targetDarkModeRef.current ? 1.0 : 0.0;
            // Only update if there's a mismatch (shouldn't happen, but safety check)
            if (Math.abs(mat.uniforms.blendFactor.value - targetBlend) > 0.01) {
              currentBlendFactorRef.current = targetBlend;
              mat.uniforms.blendFactor.value = targetBlend;
              mat.uniforms.emissiveIntensity.value = targetBlend * 0.1; // Very subtle emissive for city lights
            }
          }
          
          // Ensure cloud opacity matches target
          const targetCloudOpacity = targetDarkModeRef.current ? 0.15 : 0.7;
          if (cloudMatRef.current && Math.abs(cloudMatRef.current.opacity - targetCloudOpacity) > 0.01) {
            currentCloudOpacityRef.current = targetCloudOpacity;
            cloudMatRef.current.opacity = targetCloudOpacity;
            cloudMatRef.current.needsUpdate = true;
          }
          
          // Ensure bloom settings match target
          const targetBloomThreshold = targetDarkModeRef.current ? 0.15 : 0.35;
          const targetBloomStrength = targetDarkModeRef.current ? 0.9 : 0.45;
          const targetBloomRadius = targetDarkModeRef.current ? 0.6 : 0.4;
          
          if (composerRef.current) {
            const bloomPass = composerRef.current.passes.find(
              (pass: any) => pass instanceof UnrealBloomPass
            ) as UnrealBloomPass | undefined;
            
            if (bloomPass) {
              if (Math.abs(bloomPass.threshold - targetBloomThreshold) > 0.01 ||
                  Math.abs(bloomPass.strength - targetBloomStrength) > 0.01 ||
                  Math.abs(bloomPass.radius - targetBloomRadius) > 0.01) {
                currentBloomThresholdRef.current = targetBloomThreshold;
                currentBloomStrengthRef.current = targetBloomStrength;
                currentBloomRadiusRef.current = targetBloomRadius;
                bloomPass.threshold = targetBloomThreshold;
                bloomPass.strength = targetBloomStrength;
                bloomPass.radius = targetBloomRadius;
              }
            }
          }
        }
      }

      // smooth camera interpolation
      if (cameraRef.current) {
        // Handle smooth camera transitions between modes
        if (isCameraTransitioningRef.current) {
          const target = cameraTransitionTargetRef.current;
          const lerpFactor = 0.04; // Smooth transition speed
          
          cameraRef.current.position.x = THREE.MathUtils.lerp(
            cameraRef.current.position.x,
            target.x,
            lerpFactor
          );
          cameraRef.current.position.y = THREE.MathUtils.lerp(
            cameraRef.current.position.y,
            target.y,
            lerpFactor
          );
          cameraRef.current.position.z = THREE.MathUtils.lerp(
            cameraRef.current.position.z,
            target.z,
            lerpFactor
          );
          
          // When transitioning to text mode, keep camera looking at Earth center
          // This fixes the issue where camera rotation was off after orbiting
          if (!isEarthModeRef.current) {
            cameraRef.current.lookAt(0, 0, 0);
          }
          
          // Check if camera is close enough to target position
          const dx = Math.abs(cameraRef.current.position.x - target.x);
          const dy = Math.abs(cameraRef.current.position.y - target.y);
          const dz = Math.abs(cameraRef.current.position.z - target.z);
          if (dx < 0.01 && dy < 0.01 && dz < 0.01) {
            cameraRef.current.position.set(target.x, target.y, target.z);
            isCameraTransitioningRef.current = false;
            
            // When in text mode, ensure camera looks at Earth center
            if (!isEarthModeRef.current) {
              cameraRef.current.lookAt(0, 0, 0);
            }
            
            // Only update OrbitControls when in earth mode
            if (controlsRef.current && isEarthModeRef.current) {
              controlsRef.current.target.set(0, 0, 0);
              controlsRef.current.update();
            }
          }
        } else if (!isEarthModeRef.current) {
          // In text mode (not transitioning), apply scroll-based z interpolation
          cameraRef.current.position.z = THREE.MathUtils.lerp(
            cameraRef.current.position.z,
            targetZRef.current,
            0.06
          );
        }
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

      // Update OrbitControls (required for damping to work)
      // Only update when controls are enabled to prevent interference during camera reset
      if (controlsRef.current && controlsRef.current.enabled) {
        controlsRef.current.update();
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
      if (earthRef.current?.material) {
        const material = earthRef.current.material;
        if (!Array.isArray(material)) {
          material.dispose();
        }
      }
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

  // Update Earth material and clouds when dark mode changes
  useEffect(() => {
    // Update target dark mode ref immediately so animation loop can read it
    targetDarkModeRef.current = isDarkMode;
    
    // Start smooth texture transition only when mode actually changes
    // Check if earth and textures are ready
    if (earthRef.current && dayMapRef.current && nightMapRef.current) {
      const mat = earthRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        // Only start transition if dark mode actually changed (not on initial mount)
        if (previousDarkModeRef.current !== null && previousDarkModeRef.current !== isDarkMode) {
          // Store current values as starting point for smooth transition
          // Note: currentBlendFactorRef is already tracking the current state, so we don't need to store it separately
          startCloudOpacityRef.current = currentCloudOpacityRef.current;
          startBloomThresholdRef.current = currentBloomThresholdRef.current;
          startBloomStrengthRef.current = currentBloomStrengthRef.current;
          startBloomRadiusRef.current = currentBloomRadiusRef.current;
          
          // Start transition from current blend state to target state
          isTransitioningRef.current = true;
          transitionStartTimeRef.current = Date.now();
          // Don't update current values here - they will be updated during animation
          // currentBlendFactorRef already has the current value, which will be used as start
        } else if (previousDarkModeRef.current === null) {
          // Initial mount - set initial state without transition
          const initialBlend = isDarkMode ? 1.0 : 0.0;
          currentBlendFactorRef.current = initialBlend;
          mat.uniforms.blendFactor.value = initialBlend;
          mat.uniforms.emissiveIntensity.value = initialBlend * 0.1; // Very subtle emissive for city lights
          
          // Set initial cloud opacity and bloom values
          const initialCloudOpacity = isDarkMode ? 0.15 : 0.7;
          const initialBloomThreshold = isDarkMode ? 0.15 : 0.35;
          const initialBloomStrength = isDarkMode ? 0.9 : 0.45;
          const initialBloomRadius = isDarkMode ? 0.6 : 0.4;
          
          currentCloudOpacityRef.current = initialCloudOpacity;
          currentBloomThresholdRef.current = initialBloomThreshold;
          currentBloomStrengthRef.current = initialBloomStrength;
          currentBloomRadiusRef.current = initialBloomRadius;
          
          startCloudOpacityRef.current = initialCloudOpacity;
          startBloomThresholdRef.current = initialBloomThreshold;
          startBloomStrengthRef.current = initialBloomStrength;
          startBloomRadiusRef.current = initialBloomRadius;
          
          if (cloudMatRef.current) {
            cloudMatRef.current.opacity = initialCloudOpacity;
            cloudMatRef.current.needsUpdate = true;
          }
          
          if (composerRef.current) {
            const bloomPass = composerRef.current.passes.find(
              (pass: any) => pass instanceof UnrealBloomPass
            ) as UnrealBloomPass | undefined;
            
            if (bloomPass) {
              bloomPass.threshold = initialBloomThreshold;
              bloomPass.strength = initialBloomStrength;
              bloomPass.radius = initialBloomRadius;
            }
          }
        }
        previousDarkModeRef.current = isDarkMode;
      }
    } else if (previousDarkModeRef.current !== null && previousDarkModeRef.current !== isDarkMode) {
      // Textures aren't loaded yet, but theme changed - store current values and start transition once textures are ready
      startCloudOpacityRef.current = currentCloudOpacityRef.current;
      startBloomThresholdRef.current = currentBloomThresholdRef.current;
      startBloomStrengthRef.current = currentBloomStrengthRef.current;
      startBloomRadiusRef.current = currentBloomRadiusRef.current;
      
      // The animation loop will handle the transition once textures are loaded
      isTransitioningRef.current = true;
      transitionStartTimeRef.current = Date.now();
      previousDarkModeRef.current = isDarkMode;
    } else if (previousDarkModeRef.current === null) {
      // Initial mount, textures not ready yet - just set the initial state
      previousDarkModeRef.current = isDarkMode;
    }
  }, [isDarkMode]);

  // Handle earth mode changes - enable/disable controls and transition camera
  useEffect(() => {
    // Update ref for use in scroll handler and animation loop
    isEarthModeRef.current = isEarthMode;
    
    if (controlsRef.current) {
      controlsRef.current.enabled = isEarthMode;
    }
    
    // Handle camera transitions between modes
    if (previousEarthModeRef.current !== null && previousEarthModeRef.current !== isEarthMode) {
      if (isEarthMode) {
        // Switching TO earth mode - move camera to centered position
        cameraTransitionTargetRef.current = { ...earthModeCameraPositionRef.current };
        isCameraTransitioningRef.current = true;
      } else {
        // Switching FROM earth mode - move camera back to text mode position
        cameraTransitionTargetRef.current = { ...textModeCameraPositionRef.current };
        isCameraTransitioningRef.current = true;
      }
    }
    
    previousEarthModeRef.current = isEarthMode;
  }, [isEarthMode]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, transition: 'opacity 0.5s ease-out' }}
    />
  );
}
