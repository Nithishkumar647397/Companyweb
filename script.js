document.addEventListener('DOMContentLoaded', () => {
    
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Navbar Scroll Blur
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Canvas Animations (High-Tech Theme) ---

    // Utility: Create Packet
    const createPacket = (yPos) => {
        return {
            x: 0,
            y: yPos,
            speed: 0.5 + Math.random() * 1.5,
            stage: 0
        };
    };

    // 1. Hero Background Canvas (Tech Grid & Packets)
    const initHeroCanvas = () => {
        const canvas = document.getElementById('hero-bg-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let packets = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero-section').offsetHeight;
        };

        const drawGrid = () => {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
            ctx.lineWidth = 1;
            const gridSize = 120;
            
            for(let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for(let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        };

        const updatePackets = () => {
            if (Math.random() < 0.04 && packets.length < 25) {
                packets.push(createPacket(Math.random() * height));
            }

            packets.forEach(p => {
                if (!prefersReducedMotion) p.x += p.speed * 0.8; 
                ctx.fillStyle = 'rgba(0, 229, 255, 0.8)'; // Cyan packets
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00E5FF';
                ctx.fillRect(p.x, p.y, 2, 2);
                ctx.shadowBlur = 0; // reset
            });

            packets = packets.filter(p => p.x < width);
        };

        const initStaticPackets = () => {
            for(let i=0; i<25; i++) {
                let p = createPacket(Math.random() * height);
                p.x = Math.random() * width;
                packets.push(p);
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            // drawGrid(); // Grid removed as requested
            updatePackets();
            
            if (!prefersReducedMotion) {
                requestAnimationFrame(animate);
            }
        };

        window.addEventListener('resize', () => {
            resize();
            if (prefersReducedMotion) {
                packets = [];
                initStaticPackets();
                animate();
            }
        });
        
        resize();
        
        if (prefersReducedMotion) {
            initStaticPackets();
            animate();
        } else {
            requestAnimationFrame(animate);
        }
    };

    // 2. Main Tech Pipeline Canvas (Looping dashboard motion)
    const initPipelineCanvas = () => {
        const canvas = document.getElementById('main-pipeline-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let nodes = [];
        let packets = [];

        const resize = () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
            
            const nodeSpacing = width / 5;
            nodes = [
                { label: 'SENSE', x: nodeSpacing * 1, y: height / 2 },
                { label: 'ANALYZE', x: nodeSpacing * 2, y: height / 2 },
                { label: 'PREDICT', x: nodeSpacing * 3, y: height / 2 },
                { label: 'ACT', x: nodeSpacing * 4, y: height / 2 }
            ];
        };

        const drawTrack = () => {
            ctx.beginPath();
            ctx.moveTo(0, height/2);
            ctx.lineTo(width, height/2);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const drawNodes = () => {
            ctx.font = '600 12px "IBM Plex Mono"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            nodes.forEach((node, index) => {
                const isActive = index === 3; // Highlight last node
                
                // Node background
                ctx.fillStyle = isActive ? 'rgba(0, 229, 255, 0.1)' : '#181E2E';
                ctx.strokeStyle = isActive ? '#00E5FF' : '#1F2937';
                ctx.lineWidth = 1;
                
                if (isActive) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#00E5FF';
                }
                
                // Draw rounded rect 
                const rectW = 80, rectH = 30;
                const rectX = node.x - rectW/2, rectY = node.y - rectH/2;
                
                ctx.fillRect(rectX, rectY, rectW, rectH);
                ctx.strokeRect(rectX, rectY, rectW, rectH);
                
                ctx.shadowBlur = 0; // reset
                
                // Text
                ctx.fillStyle = isActive ? '#00E5FF' : '#F3F4F6';
                ctx.fillText(node.label, node.x, node.y);
            });
        };

        const updatePackets = () => {
            if (Math.random() < 0.03 && packets.length < 15) {
                packets.push(createPacket(height / 2));
            }

            packets.forEach((p) => {
                if (!prefersReducedMotion) {
                    p.x += p.speed;
                }
                
                if (p.x > nodes[0].x && p.stage === 0) p.stage = 1;
                if (p.x > nodes[1].x && p.stage === 1) p.stage = 2;
                if (p.x > nodes[2].x && p.stage === 2) p.stage = 3;
                if (p.x > nodes[3].x && p.stage === 3) p.stage = 4;

                ctx.fillStyle = p.stage === 4 ? '#00E5FF' : 'rgba(0, 229, 255, 0.8)';
                let size = 4;
                
                if (p.stage === 4) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00E5FF';
                }

                // Slight pulse if moving
                if (!prefersReducedMotion && p.stage > 0 && p.stage < 4) {
                    size = 4 + Math.sin(p.x * 0.1) * 1.5;
                }
                
                ctx.fillRect(p.x - size/2, p.y - size/2, size, size);
                ctx.shadowBlur = 0; // reset
            });

            packets = packets.filter(p => p.x < width);
        };

        const initStaticPackets = () => {
            const positions = [width*0.15, width*0.35, width*0.55, width*0.75, width*0.95];
            positions.forEach(x => {
                let p = createPacket(height / 2);
                p.x = x;
                if (p.x > nodes[0].x) p.stage = 1;
                if (p.x > nodes[1].x) p.stage = 2;
                if (p.x > nodes[2].x) p.stage = 3;
                if (p.x > nodes[3].x) p.stage = 4;
                packets.push(p);
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            drawTrack();
            drawNodes();
            updatePackets();
            
            if (!prefersReducedMotion) {
                requestAnimationFrame(animate);
            }
        };

        window.addEventListener('resize', () => {
            resize();
            if (prefersReducedMotion) {
                packets = [];
                initStaticPackets();
                animate();
            }
        });
        
        resize();
        
        if (prefersReducedMotion) {
            initStaticPackets();
            animate();
        } else {
            requestAnimationFrame(animate);
        }
    };

    initHeroCanvas();
    initPipelineCanvas();

    // --- Global Cursor Animation ---
    const initCursorAnimation = () => {
        if (prefersReducedMotion) return;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const mouse = { x: -100, y: -100 };
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            // Reduced to 1 particle per move and added a random chance so it's less dense
            if (Math.random() > 0.3) {
                particles.push({
                    x: mouse.x,
                    y: mouse.y,
                    vx: (Math.random() - 0.5) * 1,
                    vy: (Math.random() - 0.5) * 1,
                    size: Math.random() * 2 + 0.5,
                    life: 0.6
                });
            }
        });

        const animateCursor = () => {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04;
                
                if (p.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }
                
                ctx.fillStyle = `rgba(0, 229, 255, ${p.life})`;
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#00E5FF';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
    };

    initCursorAnimation();
});
