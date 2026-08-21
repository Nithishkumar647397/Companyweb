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

    // --- Canvas Animations ---

    // Utility: Create Packet
    const createPacket = (yPos) => {
        return {
            x: 0,
            y: yPos,
            speed: 0.5 + Math.random() * 1.0,
            stage: 0
        };
    };

    // 1. Hero Background Canvas (Extremely subtle, faint lines/dots)
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
            ctx.strokeStyle = 'rgba(10,11,13,0.03)';
            ctx.lineWidth = 1;
            const gridSize = 100;
            
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
            if (Math.random() < 0.02 && packets.length < 15) {
                packets.push(createPacket(Math.random() * height));
            }

            packets.forEach(p => {
                if (!prefersReducedMotion) p.x += p.speed * 0.5; // Very slow
                ctx.fillStyle = 'rgba(62, 123, 250, 0.15)'; // Faint blue
                ctx.fillRect(p.x, p.y, 2, 2);
            });

            packets = packets.filter(p => p.x < width);
        };

        const initStaticPackets = () => {
            for(let i=0; i<15; i++) {
                let p = createPacket(Math.random() * height);
                p.x = Math.random() * width;
                packets.push(p);
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            drawGrid();
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

    // 2. Main Tech Pipeline Canvas (Looping diagram motion)
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
            ctx.strokeStyle = 'rgba(10,11,13,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const drawNodes = () => {
            ctx.font = '600 12px "IBM Plex Mono"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            nodes.forEach((node, index) => {
                // Node background
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = index === 3 ? '#3E7BFA' : 'rgba(10,11,13,0.2)';
                ctx.lineWidth = index === 3 ? 2 : 1;
                
                // Draw rounded rect (simplified fallback for canvas)
                const rectW = 80, rectH = 30;
                const rectX = node.x - rectW/2, rectY = node.y - rectH/2;
                
                ctx.fillRect(rectX, rectY, rectW, rectH);
                ctx.strokeRect(rectX, rectY, rectW, rectH);
                
                // Text
                ctx.fillStyle = index === 3 ? '#3E7BFA' : '#0A0B0D';
                ctx.fillText(node.label, node.x, node.y);
            });
        };

        const updatePackets = () => {
            if (Math.random() < 0.02 && packets.length < 10) {
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

                ctx.fillStyle = p.stage === 4 ? '#3E7BFA' : 'rgba(10,11,13,0.3)';
                let size = 4;
                
                // Slight pulse if moving
                if (!prefersReducedMotion && p.stage > 0 && p.stage < 4) {
                    size = 4 + Math.sin(p.x * 0.1) * 1.5;
                }
                
                ctx.fillRect(p.x - size/2, p.y - size/2, size, size);
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
});
