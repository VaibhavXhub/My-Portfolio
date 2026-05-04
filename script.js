const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');

let lines = [];

// --- DYNAMIC BACKGROUND ENGINE ---
// Function to calculate and distribute lines perfectly across lanes
function initLines() {
    // 1. Ensure canvas always matches screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 2. Clear the array if we are resetting
    lines = [];
    
    // 3. Dynamically calculate the perfect number of lines for the screen size.
    // This creates roughly 1 line for every 35 pixels of screen width.
    let numLines = Math.floor(canvas.width / 35);
    
    // Ensure it never looks too sparse on very small mobile screens
    if (numLines < 15) numLines = 15; 
    
    // 4. Calculate the width of each "lane"
    let laneWidth = canvas.width / numLines;

    for (let i = 0; i < numLines; i++) {
        lines.push({
            // Place the line inside its specific lane, with a tiny random variance
            x: (i * laneWidth) + (Math.random() * (laneWidth * 0.5)),
            y: Math.random() * canvas.height,
            length: Math.random() * 80 + 20, // Shorter, sleeker lines
            speed: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.4 + 0.1 // Subtle transparency for depth
        });
    }
}

// Handle window resize dynamically (redistributes lines if you rotate your phone)
window.addEventListener('resize', () => {
    initLines();
});

function animateTechLines() {
    requestAnimationFrame(animateTechLines);
    
    // Completely clear the canvas every single frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Create a custom gradient for each individual line
        let gradient = ctx.createLinearGradient(line.x, line.y, line.x, line.y + line.length);
        
        // The tail fades to completely transparent
        gradient.addColorStop(0, 'rgba(0, 255, 100, 0)'); 
        // The body is neon green
        gradient.addColorStop(0.8, `rgba(0, 255, 100, ${line.opacity})`); 
        // The leading tip is bright white for a sharp, high-tech look
        gradient.addColorStop(1, '#ffffff'); 

        // Draw the line
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();

        // Move the line down
        line.y += line.speed;

        // Reset line to the top smoothly when it falls off screen.
        // It stays in its assigned lane (we do not randomize X here).
        if (line.y > canvas.height) {
            line.y = -line.length;
        }
    }
}

// --- PREMIUM SMOOTH SCROLL WITH NAVBAR OFFSET ---
// --- MOBILE MENU TOGGLE LOGIC ---
// --- INDESTRUCTIBLE NAVBAR SCROLL LOGIC ---
document.addEventListener('click', function(e) {
    // 1. Check if the user clicked a link that starts with '#'
    const anchor = e.target.closest('a[href^="#"]');
    
    if (anchor) {
        // 2. Only intercept if the link has an actual ID attached (ignores generic '#' links)
        const href = anchor.getAttribute('href');
        if (href.length > 1) {
            e.preventDefault(); 
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                
                // Calculate position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                
                // Execute smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if clicked on a phone
                if (window.innerWidth <= 768) {
                    const navLinks = document.querySelector('.nav-links');
                    const hamburger = document.getElementById('hamburger');
                    if (navLinks) navLinks.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('toggle');
                }
            }
        }
    }
});

// --- INTERACTIVE SKILLS STACK ---
const skillsStack = document.getElementById('skills-stack');

if(skillsStack) {
    skillsStack.addEventListener('click', () => {
        // Toggles the 'is-spread' class on and off every time you click
        skillsStack.classList.toggle('is-spread');
    });
}

// --- INITIALIZE THE APP ---
// Calculate lines and start the animation loop
initLines();
animateTechLines();

// --- 3D SCROLLYTELLING WITH THREE.JS & GSAP ---

gsap.registerPlugin(ScrollTrigger);

const canvasContainer = document.getElementById('three-canvas-container');

if (canvasContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // 3D Object Upgrade: A complex, high-tech Torus Knot
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 16); 
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff66, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const shape = new THREE.Mesh(geometry, material);
    
    // Solid black core to give it physical depth
    const coreGeometry = new THREE.TorusKnotGeometry(1.45, 0.38, 128, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); 
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    
    const objectGroup = new THREE.Group();
    objectGroup.add(shape);
    objectGroup.add(core);
    scene.add(objectGroup);

    camera.position.z = 5;

    // Position object on the right for laptop, top for mobile
    // Position object perfectly for Laptop vs Mobile
    function positionObject() {
        if(window.innerWidth < 768) {
            // MOBILE: Dead center, but pushed backward on the Z-axis (-2) 
            // so it spins beautifully behind the text without blocking it.
            objectGroup.position.set(0, 0, -2); 
            objectGroup.scale.set(0.9, 0.9, 0.9);
        } else {
            // LAPTOP: Safely tucked on the right side of the screen
            objectGroup.position.set(3, 0, 0); 
            objectGroup.scale.set(1, 1, 1);
        }
    }
    positionObject();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        positionObject();
    });

    // Base slow rotation
    function animate3D() {
        requestAnimationFrame(animate3D);
        objectGroup.rotation.x += 0.002;
        objectGroup.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate3D();

    // --- GSAP SMOOTH SCROLL ANIMATIONS ---

    // 1. The 3D Torus Knot twists dynamically as you scroll down the timeline
    gsap.to(objectGroup.rotation, {
        y: Math.PI * 3, // Spins multiple times
        x: Math.PI,
        scrollTrigger: {
            trigger: ".timeline-container",
            start: "top bottom", 
            end: "bottom top",   
            scrub: 1.5 // The higher the scrub number, the smoother and more fluid the delay
        }
    });

    // 2. Animate each Timeline Node fading and sliding in as you scroll
    const nodes = gsap.utils.toArray('.timeline-node');
    
    nodes.forEach((node) => {
        // Set initial state before scrolling hits it
        gsap.set(node, { opacity: 0, y: 100 });

        gsap.to(node, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: node,
                start: "top 80%", // Triggers when the top of the card is 80% down the screen
                toggleActions: "play none none reverse" // Fades out if you scroll back up
            }
        });
    });
}

// Portfolio
// --- INTERACTIVE 3D PORTFOLIO GRID ENGINE (THREE.JS & GSAP) ---

gsap.registerPlugin(ScrollTrigger);

const portfolioCards = gsap.utils.toArray('.portfolio-card');

portfolioCards.forEach((card) => {
    // 1. Set up the specific Three.js context for this card
    const container = card.querySelector('.card-3d-container');
    const shapeType = card.getAttribute('data-three-type');

    if (!container) return; // Safety check

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    camera.position.z = 4;

    // 2. Define the different 3D elements (Sphere, Octa, etc.)
    // 2. Define the different 3D elements
    let geometry;
    switch (shapeType) {
        case 'sphere':   geometry = new THREE.SphereGeometry(1.5, 16, 16); break;
        case 'octa':     geometry = new THREE.OctahedronGeometry(1.5, 1); break;
        case 'torus':    geometry = new THREE.TorusGeometry(1.2, 0.4, 12, 32); break;
        case 'cube':     geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8); break;
        // --- NEW SHAPES UNLOCKED ---
        case 'cone':     geometry = new THREE.ConeGeometry(1.2, 2, 16); break;
        case 'cylinder': geometry = new THREE.CylinderGeometry(1, 1, 2, 16); break;
        case 'dodeca':   geometry = new THREE.DodecahedronGeometry(1.5, 0); break; // 12-sided polygon
        case 'tetra':    geometry = new THREE.TetrahedronGeometry(1.5, 0); break;  // 4-sided pyramid
        case 'ring':     geometry = new THREE.RingGeometry(0.5, 1.5, 32); break;   // Flat glowing disc
        default:         geometry = new THREE.SphereGeometry(1.5, 16, 16);
    }

    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff66, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.25 
    });
    
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // 3. Animation State (Track if card is hovered)
    let rotationMultiplier = 1;
    let baseOpacity = 0.25;

    // Laptop Hover Interaction: Spin faster and glow green
    card.addEventListener('mouseenter', () => {
        rotationMultiplier = 8; // Spins 8x faster on hover
        gsap.to(material, { opacity: 0.8, duration: 0.3 }); // Glows brighter green
        gsap.to(camera.position, { z: 3.5, duration: 0.4 }); // Zooms in slightly
    });

    card.addEventListener('mouseleave', () => {
        rotationMultiplier = 1; // Resets spin speed
        gsap.to(material, { opacity: 0.25, duration: 0.3 }); // Resets glow
        gsap.to(camera.position, { z: 4, duration: 0.4 }); // Resets zoom
    });

    // Handle internal resize for the specific card container
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    // The Miniature Animation Loop for this card
    function animateCard3D() {
        requestAnimationFrame(animateCard3D);
        shape.rotation.y += 0.005 * rotationMultiplier;
        shape.rotation.x += 0.002 * rotationMultiplier;
        renderer.render(scene, camera);
    }
    animateCard3D();

    // 4. GSAP Scroll Entrance Animation (Cards "roll" into place)
    gsap.set(card, { opacity: 0, y: 50, rotateX: 15 }); // Initial broken state

    gsap.to(card, {
        opacity: 1,
        y: 0,
        rotateX: 0, // Cards straighten up as they fade in
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
            trigger: card,
            start: "top 85%", // Triggers when the top of the card is 85% down the screen
            toggleActions: "play none none reverse"
        }
    });
});

// contact page
// ==========================================
// 6. TERMINAL CONTACT FORM & SUPABASE BACKEND
// ==========================================

// 1. Initialize the Supabase Connection
// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const _supabaseUrl = 'https://mwsvwodcfnukeezzktpq.supabase.co';
const _supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13c3Z3b2RjZm51a2VlenprdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MzMzOTcsImV4cCI6MjA5MTUwOTM5N30.IYRI5Zlczy93FFcroc9oXtZwKYR8K78AF2yHXDGDKHs';

// Create the client (the 'supabase' object is available globally because of the CDN script we added to the HTML)
const supabaseClient = window.supabase.createClient(_supabaseUrl, _supabaseKey);

// 2. Form Logic
const contactForm = document.getElementById('secure-contact-form');
const successMsg = document.getElementById('success-msg');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // Grab the button and change text to show processing state
        const btn = contactForm.querySelector('.form-submit');
        const originalBtnText = btn.textContent;
        btn.textContent = "Transmitting Payload...";
        btn.disabled = true; // Prevent double-clicking
        
        // Extract the data from your inputs
        const senderName = document.getElementById('name').value;
        const senderEmail = document.getElementById('email').value;
        const senderMessage = document.getElementById('message').value;

        try {
            // 3. Fire the data to the Supabase 'contacts' table
            const { data, error } = await supabaseClient
                .from('contacts')
                .insert([
                    { 
                        name: senderName, 
                        email: senderEmail, 
                        message: senderMessage 
                    }
                ]);

            if (error) {
                throw error; // Triggers the catch block below
            }

            // 4. Success State
            contactForm.style.display = 'none'; 
            successMsg.style.display = 'block';
            console.log("Transmission Successful. Data secured in Supabase.");

        } catch (error) {
            // 5. Error State
            console.error("Transmission Failed:", error.message);
            alert("System Error: Payload failed to transmit. Please check your console.");
            
            // Reset button so they can try again
            btn.textContent = originalBtnText;
            btn.disabled = false;
        }
    });
}

// New 3d element for top 
// ==========================================
// 7. HERO SECTION 3D CORE (WITH PARALLAX)
// ==========================================
const heroContainer = document.getElementById('hero-3d-container');

if (heroContainer) {
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(75, heroContainer.offsetWidth / heroContainer.offsetHeight, 0.1, 1000);
    const heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    heroRenderer.setSize(heroContainer.offsetWidth, heroContainer.offsetHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);
    heroContainer.appendChild(heroRenderer.domElement);

    // Build the Hero Object (A massive, sharp Icosahedron)
    // 1. SHRINK IT: Change 2.5 to 1.5 (or whatever size looks best to you)
    const heroGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    const heroMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff66, 
        wireframe: true,
        wireframeLinewidth: 2, 
        transparent: true,
        opacity: 0.85 
    });
    
    const heroShape = new THREE.Mesh(heroGeometry, heroMaterial);
    
    // 2. SHIFT IT LEFT: This physically moves the 3D object behind your card
    // Note: You can tweak this number (-1.5, -2, etc.) to get it perfectly aligned
    heroShape.position.x = -1.5; 
    
    heroScene.add(heroShape);

    heroCamera.position.z = 6;

    // Track mouse position for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    window.addEventListener('resize', () => {
        heroCamera.aspect = heroContainer.offsetWidth / heroContainer.offsetHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(heroContainer.offsetWidth, heroContainer.offsetHeight);
    });

    // Animate and apply mouse parallax
    function animateHero3D() {
        requestAnimationFrame(animateHero3D);
        
        // Base rotation
        heroShape.rotation.y += 0.002;
        heroShape.rotation.x += 0.001;

        // Smooth parallax targeting based on mouse
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        heroShape.rotation.y += 0.05 * (targetX - heroShape.rotation.y);
        heroShape.rotation.x += 0.05 * (targetY - heroShape.rotation.x);

        heroRenderer.render(heroScene, heroCamera);
    }
    
    animateHero3D();
    
    // Add a GSAP scroll effect to fade it out as you scroll down
    gsap.to(heroContainer, {
        opacity: 0,
        y: 100,
        scrollTrigger: {
            trigger: heroContainer,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}