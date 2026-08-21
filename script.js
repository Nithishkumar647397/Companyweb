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
            speed: 0.8 + Math.random() * 1.5,
            stage: 0
        };
    };

    // 1. Hero Background Canvas (Faint, ambient)
    const initHeroPipeline = () => {
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
            ctx.strokeStyle = 'rgba(255,255,255,0.015)';
            ctx.lineWidth = 1;
            const gridSize = 60;
            
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
            if (Math.random() < 0.05 && packets.length < 30) {
                packets.push(createPacket(Math.random() * height));
            }

            packets.forEach(p => {
                if (!prefersReducedMotion) p.x += p.speed;
                ctx.fillStyle = 'rgba(57, 214, 232, 0.4)';
                ctx.fillRect(p.x, p.y, 3, 3);
            });

            packets = packets.filter(p => p.x < width);
        };

        const initStaticPackets = () => {
            for(let i=0; i<30; i++) {
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

    // 2. Main Tech Pipeline Canvas (Detailed, interactive)
    const initMainPipeline = () => {
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
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const drawNodes = () => {
            ctx.font = '12px "IBM Plex Mono"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            nodes.forEach((node, index) => {
                ctx.fillStyle = '#16181D';
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = 1;
                ctx.fillRect(node.x - 40, node.y - 15, 80, 30);
                ctx.strokeRect(node.x - 40, node.y - 15, 80, 30);
                
                ctx.fillStyle = '#39D6E8'; // Cyan text for nodes
                ctx.fillText(node.label, node.x, node.y);
            });
        };

        const updatePackets = () => {
            if (Math.random() < 0.03 && packets.length < 20) {
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

                // Color mapping: grey -> cyan -> electric blue
                if (p.stage === 0) ctx.fillStyle = 'rgba(255,255,255,0.3)';
                else if (p.stage === 1 || p.stage === 2) ctx.fillStyle = '#39D6E8';
                else ctx.fillStyle = '#3E7BFA';
                
                ctx.shadowBlur = (p.stage > 0) ? 8 : 0;
                ctx.shadowColor = ctx.fillStyle;
                
                // Pulse size based on stage (simulate processing)
                let size = 6;
                if (!prefersReducedMotion && (p.stage === 1 || p.stage === 2)) {
                    size = 6 + Math.sin(p.x * 0.1) * 2;
                }
                
                ctx.fillRect(p.x - size/2, p.y - size/2, size, size);
                ctx.shadowBlur = 0;
            });

            packets = packets.filter(p => p.x < width);
        };

        const initStaticPackets = () => {
            const positions = [width*0.1, width*0.3, width*0.5, width*0.7, width*0.9];
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

    // 3. Systemic Divider Motif
    const initDividers = () => {
        const dividers = document.querySelectorAll('.divider-canvas');
        
        dividers.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            let width, height;
            let packets = [];

            const resize = () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = canvas.offsetHeight || 2;
            };

            const updatePackets = () => {
                if (Math.random() < 0.05 && packets.length < 5) {
                    packets.push({ x: 0, speed: 2 + Math.random() * 2 });
                }

                packets.forEach(p => {
                    if (!prefersReducedMotion) p.x += p.speed;
                    ctx.fillStyle = '#39D6E8';
                    ctx.fillRect(p.x, 0, 15, height); // horizontal dash
                });

                packets = packets.filter(p => p.x < width);
            };

            const initStaticPackets = () => {
                for(let i=0; i<3; i++) {
                    packets.push({ x: Math.random() * width, speed: 0 });
                }
            }

            const animate = () => {
                ctx.clearRect(0, 0, width, height);
                
                // Base line
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(0, 0, width, height);
                
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
        });
    };

    initHeroPipeline();
    initMainPipeline();
    initDividers();
});
