import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BangladeshFlag = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 600/450, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(600, 450);
    containerRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 5;

    // Create flag geometry with more vertices for smoother animation
    const flagGeometry = new THREE.PlaneGeometry(6, 3.6, 40, 40);
    
    // Create flag material with Bangladesh flag colors
    const flagMaterial = new THREE.MeshPhongMaterial({
      color: 0x006a4e, // Bangladesh flag green
      side: THREE.DoubleSide,
    });

    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    scene.add(flag);

    // Create static red circle
    const circleGroup = new THREE.Group();
    const circleGeometry = new THREE.CircleGeometry(0.9, 32);
    const circleMaterial = new THREE.MeshPhongMaterial({
      color: 0xf42a41, // Bangladesh flag red
      side: THREE.DoubleSide,
      depthTest: false // Ensures circle is always rendered on top
    });
    
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circleGroup.add(circle);
    circleGroup.position.z = 0.1; // Place circle in front of flag
    scene.add(circleGroup);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Wave animation for the flag only
      const time = Date.now() * 0.002;
      const vertices = flagGeometry.attributes.position.array;

      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        
        // Create wave effect
        vertices[i + 2] = Math.sin(x * 1.5 + time) * 0.2 + 
                         Math.sin(y * 2 + time) * 0.1;
      }

      flagGeometry.attributes.position.needsUpdate = true;
      
      // Subtle rotation for both flag and circle
      const rotationAmount = Math.sin(time * 0.5) * 0.2;
      flag.rotation.y = rotationAmount;
      circleGroup.rotation.y = rotationAmount;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(600, 450);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      flagGeometry.dispose();
      flagMaterial.dispose();
      circleGeometry.dispose();
      circleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{
        width: '600px',
        height: '450px',
      }}
    />
  );
};

export default BangladeshFlag; 