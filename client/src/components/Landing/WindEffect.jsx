import React, { useEffect } from 'react';

const WindEffect = ({ children }) => {
  useEffect(() => {
    const sections = document.querySelectorAll('.wind-effect');
    let windDirection = 1;
    let lastTime = 0;
    const windChangeInterval = 5000;

    const animate = (currentTime) => {
      if (currentTime - lastTime >= windChangeInterval) {
        windDirection *= -1;
        lastTime = currentTime;
      }

      sections.forEach((section) => {
        const movement = Math.sin(currentTime / 1000) * 0.5 * windDirection;
        section.style.transform = `translateX(${movement}px)`;
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      sections.forEach((section) => {
        section.style.transform = 'translateX(0)';
      });
    };
  }, []);

  return (
    <div className="wind-effect" style={{ transition: 'transform 0.1s ease-out' }}>
      {children}
    </div>
  );
};

export default WindEffect; 