import React, { useEffect, useRef } from 'react';

const HempParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Particle configuration
        const particleCount = 10    ; // Number of hemp leaves
        const dustCount = 40;     // Number of small dust particles for depth
        const particles = [];

        // Hemp Leaf SVG Path Data (Simplified)
        // A standard 7-point leaf shape
        const drawLeaf = (ctx, size) => {
            ctx.beginPath();
            // Center bottom
            ctx.moveTo(0, size);
            // Center leaflet
            ctx.bezierCurveTo(size * 0.1, size * 0.5, size * 0.2, 0, 0, -size);
            ctx.bezierCurveTo(-size * 0.2, 0, -size * 0.1, size * 0.5, 0, size);

            // Side leaflets (simplified loop could be used but hardcoding for specific shape)
            // Left 1
            ctx.moveTo(0, size * 0.8);
            ctx.bezierCurveTo(-size * 0.3, size * 0.4, -size * 0.6, -size * 0.2, -size * 0.5, -size * 0.6);
            ctx.bezierCurveTo(-size * 0.4, -size * 0.1, -size * 0.1, size * 0.6, 0, size * 0.8);
            // Right 1
            ctx.moveTo(0, size * 0.8);
            ctx.bezierCurveTo(size * 0.3, size * 0.4, size * 0.6, -size * 0.2, size * 0.5, -size * 0.6);
            ctx.bezierCurveTo(size * 0.4, -size * 0.1, size * 0.1, size * 0.6, 0, size * 0.8);

            // Left 2
            ctx.moveTo(0, size * 0.9);
            ctx.bezierCurveTo(-size * 0.2, size * 0.6, -size * 0.5, 0.1, -size * 0.6, -size * 0.1);
            ctx.bezierCurveTo(-size * 0.4, 0.3, -size * 0.1, size * 0.7, 0, size * 0.9);
            // Right 2
            ctx.moveTo(0, size * 0.9);
            ctx.bezierCurveTo(size * 0.2, size * 0.6, size * 0.5, 0.1, size * 0.6, -size * 0.1);
            ctx.bezierCurveTo(size * 0.4, 0.3, size * 0.1, size * 0.7, 0, size * 0.9);

            ctx.fill();
        };

        class Particle {
            constructor(isLeaf = false) {
                this.isLeaf = isLeaf;
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = this.isLeaf ? Math.random() * 15 + 10 : Math.random() * 2 + 0.5; // Leaf 10-25px, Dust 0.5-2.5px
                this.speedX = (Math.random() - 0.5) * (this.isLeaf ? 0.8 : 0.3);
                this.speedY = (Math.random() - 0.5) * (this.isLeaf ? 0.8 : 0.3) - (this.isLeaf ? 0.2 : 0); // Slight upward drift for leaves
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.opacity = Math.random() * 0.5 + 0.1;
                // Green shades for leaves, white/grey for dust
                this.color = this.isLeaf
                    ? `rgba(${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 50 + 80)}, ${this.opacity})` // #4caf50 variations
                    : `rgba(255, 255, 255, ${this.opacity * 0.5})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Wrap around screen
                if (this.x < -50) this.x = canvas.width + 50;
                if (this.x > canvas.width + 50) this.x = -50;
                if (this.y < -50) this.y = canvas.height + 50;
                if (this.y > canvas.height + 50) this.y = -50;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;

                if (this.isLeaf) {
                    drawLeaf(ctx, this.size);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(true));
        }
        for (let i = 0; i < dustCount; i++) {
            particles.push(new Particle(false));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
};

export default HempParticles;
