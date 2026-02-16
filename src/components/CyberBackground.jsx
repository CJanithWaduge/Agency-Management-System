import React, { useEffect, useRef } from 'react';

const CyberBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\|!@#$%^&*()_+';
        const fontSize = 14;
        let columns = Math.ceil(window.innerWidth / fontSize);
        let drops = new Array(columns).fill(1).map(() => Math.random() * -100);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Recalculate columns on resize
            const newColumns = Math.ceil(canvas.width / fontSize);
            if (newColumns > columns) {
                // Add new drops for the new area
                const additionalDrops = new Array(newColumns - columns).fill(1).map(() => Math.random() * -100);
                drops = [...drops, ...additionalDrops];
                columns = newColumns;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Dynamic Networking Particles
        const particles = [];
        const particleCount = 70;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 1
            });
        }

        const draw = () => {
            // Background with trail effect
            ctx.fillStyle = 'rgba(2, 6, 23, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // --- Matrix Digital Rain (Enhanced) ---
            ctx.font = `bold ${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = characters.charAt(Math.floor(Math.random() * characters.length));

                // 1. Leading edge (Brightest)
                ctx.fillStyle = `rgba(165, 243, 252, 0.9)`; // Very bright cyan/white-ish
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                // 2. Main trail (Cyan)
                ctx.fillStyle = `rgba(34, 211, 238, 0.6)`;
                ctx.fillText(characters.charAt(Math.floor(Math.random() * characters.length)), i * fontSize, (drops[i] - 1) * fontSize);

                // 3. Fading tail (Blue)
                ctx.fillStyle = `rgba(30, 64, 175, 0.3)`;
                ctx.fillText(characters.charAt(Math.floor(Math.random() * characters.length)), i * fontSize, (drops[i] - 3) * fontSize);

                // 4. Very faint distant tail
                ctx.fillStyle = `rgba(30, 64, 175, 0.15)`;
                ctx.fillText(characters.charAt(Math.floor(Math.random() * characters.length)), i * fontSize, (drops[i] - 6) * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            // --- Animated Security Mesh ---
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Glowing core for particles
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                gradient.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
                ctx.fill();

                // Connect particles with glowing lines
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 180) {
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * (1 - dist / 180)})`;
                        ctx.lineWidth = dist < 70 ? 1 : 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // --- Security Scan Pulse ---
            const time = Date.now() * 0.001;
            const scanY = (Math.sin(time * 0.4) * 0.5 + 0.5) * canvas.height;

            const scanGradient = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
            scanGradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
            scanGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.06)');
            scanGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

            ctx.fillStyle = scanGradient;
            ctx.fillRect(0, scanY - 60, canvas.width, 120);

            // Bright scanning wireframe
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(canvas.width, scanY);
            ctx.stroke();

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                background: '#020617'
            }}
        />
    );
};

export default CyberBackground;
