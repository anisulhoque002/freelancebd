import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RainBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const raindropsRef = useRef([]);
  const leavesRef = useRef([]);
  const windDirectionRef = useRef(1);
  const windChangeInterval = 5000;

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 5;
    sceneRef.current = scene;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Create gradient background
    const gradientGeometry = new THREE.PlaneGeometry(100, 100);
    const gradientCanvas = document.createElement('canvas');
    const gradientContext = gradientCanvas.getContext('2d');
    gradientCanvas.width = 512;
    gradientCanvas.height = 512;

    const gradient = gradientContext.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
    gradient.addColorStop(0, 'rgba(144, 238, 144, 0.3)');  // Light green with transparency
    gradient.addColorStop(1, 'rgba(255, 182, 193, 0.3)');  // Light red (pink) with transparency

    gradientContext.fillStyle = gradient;
    gradientContext.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

    const gradientTexture = new THREE.CanvasTexture(gradientCanvas);
    const gradientMaterial = new THREE.MeshBasicMaterial({
      map: gradientTexture,
      transparent: true,
      depthWrite: false,
    });

    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.z = -10;
    scene.add(gradientMesh);

    // Create raindrops
    const raindropGeometry = new THREE.BufferGeometry();
    const raindrops = [];
    const positions = [];
    const raindropCount = 1500;

    for (let i = 0; i < raindropCount; i++) {
      const raindrop = {
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
        z: Math.random() * 40 - 20,
        speed: Math.random() * 0.1 + 0.1,
      };
      raindrops.push(raindrop);
      positions.push(raindrop.x, raindrop.y, raindrop.z);
    }

    raindropGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const raindropMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });

    const raindropPoints = new THREE.Points(raindropGeometry, raindropMaterial);
    scene.add(raindropPoints);
    raindropsRef.current = raindrops;

    // Create realistic leaf shapes
    const createLeafShape = () => {
      const shape = new THREE.Shape();
      
      // Start at the leaf stem
      shape.moveTo(0, 0);
      
      // Draw one side of the leaf
      shape.bezierCurveTo(0.5, 1, 1.5, 1.5, 2, 0.5);
      shape.bezierCurveTo(2.2, 0.2, 2, -0.5, 1.5, -1);
      
      // Draw the other side
      shape.bezierCurveTo(1, -1.5, 0, -1, -0.5, -0.5);
      shape.bezierCurveTo(-1, 0, -0.5, 0.5, 0, 0);
      
      return shape;
    };

    // Create leaves
    const leaves = [];
    const leafCount = 30;
    const leafColors = [
      // Green colors
      0x228B22, // Forest Green
      0x32CD32, // Lime Green
      0x90EE90, // Light Green
      0x2E8B57, // Sea Green
      // Red colors
      0xFF4500, // Orange Red
      0xDC143C, // Crimson
      0x8B0000, // Dark Red
      0xFF6B6B, // Light Red
      // Yellow colors
      0xFFD700, // Gold
      0xFFFF00, // Yellow
      0xFFE4B5, // Moccasin
      0xDAA520  // Goldenrod
    ];

    for (let i = 0; i < leafCount; i++) {
      const leafShape = createLeafShape();
      const leafGeometry = new THREE.ShapeGeometry(leafShape, 32);
      
      // Scale down the leaf
      leafGeometry.scale(0.2, 0.2, 0.2);

      const leafMaterial = new THREE.MeshPhongMaterial({
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        shininess: 50,
      });

      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      // Random initial position
      leaf.position.x = Math.random() * 40 - 20;
      leaf.position.y = Math.random() * 40 - 20;
      leaf.position.z = Math.random() * 40 - 20;
      
      // Random initial rotation
      leaf.rotation.x = Math.random() * Math.PI;
      leaf.rotation.y = Math.random() * Math.PI;
      leaf.rotation.z = Math.random() * Math.PI;
      
      // Add custom properties for natural movement
      leaf.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.02,
        },
        fallSpeed: Math.random() * 0.02 + 0.01,
        swayAmount: Math.random() * 0.03 + 0.01,
        swaySpeed: Math.random() * 0.002 + 0.001,
        swayOffset: Math.random() * Math.PI * 2,
        spinAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize(),
        spinSpeed: Math.random() * 0.02 + 0.01,
      };
      
      scene.add(leaf);
      leaves.push(leaf);
    }
    
    leavesRef.current = leaves;

    // Wind direction change
    const windInterval = setInterval(() => {
      windDirectionRef.current *= -1;
    }, windChangeInterval);

    let animationFrameId;
    // Animation
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update raindrops
      const positions = raindropGeometry.attributes.position.array;
      for (let i = 0; i < raindrops.length; i++) {
        const raindrop = raindrops[i];
        raindrop.y -= raindrop.speed;
        raindrop.x += 0.002 * windDirectionRef.current;

        if (raindrop.y < -20) {
          raindrop.y = 20;
          raindrop.x = Math.random() * 40 - 20;
        }

        positions[i * 3] = raindrop.x;
        positions[i * 3 + 1] = raindrop.y;
      }
      raindropGeometry.attributes.position.needsUpdate = true;

      // Update leaves with natural movement
      const time = Date.now() * 0.001;
      leaves.forEach(leaf => {
        // Falling movement
        leaf.position.y -= leaf.userData.fallSpeed;
        
        // Horizontal sway movement
        const swayX = Math.sin(time * leaf.userData.swaySpeed + leaf.userData.swayOffset) * 
                     leaf.userData.swayAmount * 
                     windDirectionRef.current;
        leaf.position.x += swayX;
        
        // Natural spinning around custom axis
        const spinAxis = leaf.userData.spinAxis;
        leaf.rotateOnAxis(spinAxis, leaf.userData.spinSpeed);
        
        // Add slight wobble
        leaf.rotation.x += Math.sin(time) * 0.01;
        leaf.rotation.z += Math.cos(time) * 0.01;

        // Reset position when leaf falls below view
        if (leaf.position.y < -20) {
          leaf.position.y = 20;
          leaf.position.x = Math.random() * 40 - 20;
          // Randomize rotation when resetting
          leaf.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      // Cancel animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      clearInterval(windInterval);

      // Dispose of Three.js resources
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (object.material.map) {
              object.material.map.dispose();
            }
            object.material.dispose();
          }
        });
      }

      // Clean up renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-gradient-to-br from-green-100/30 to-red-100/30 pointer-events-none"
      />
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </>
  );
};

export default RainBackground; 