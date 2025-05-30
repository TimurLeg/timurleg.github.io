// js/particleAnimation.js
import { canvas, ctx } from './uiElements.js';

let particlesArray;
let mouse = { x: null, y: null, radius: 150 };
let animationFrameId;

function getAnimationColors() {
    const styles = getComputedStyle(document.body);
    return {
        particle: styles.getPropertyValue('--particle-color').trim(),
        line: styles.getPropertyValue('--line-color').trim()
    };
}

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (!canvas) return;
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    if (!canvas || !ctx) return;
    particlesArray = [];
    const animationColors = getAnimationColors();
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    numberOfParticles = Math.min(numberOfParticles, 120);

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * .3) - .15;
        let directionY = (Math.random() * .3) - .15;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, animationColors.particle));
    }
}

function connectParticles() {
    if (!canvas || !ctx || !particlesArray) return;
    const animationColors = getAnimationColors();
    let opacityValue = 1;
    if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particlesArray.length; i++) {
            let dxMouse = mouse.x - particlesArray[i].x;
            let dyMouse = mouse.y - particlesArray[i].y;
            let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distanceMouse < mouse.radius) {
                opacityValue = 1 - (distanceMouse / mouse.radius);
                ctx.strokeStyle = animationColors.line.replace(/[\d\.]+\)$/g, opacityValue + ')');
                ctx.lineWidth = 0.8; ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(particlesArray[i].x, particlesArray[i].y);
                ctx.stroke();
            }
        }
    }
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 10) * (canvas.height / 10) && distance < 8000) {
                opacityValue = 1 - (distance / 8000);
                ctx.strokeStyle = animationColors.line.replace(/[\d\.]+\)$/g, opacityValue + ')');
                ctx.lineWidth = 0.3;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (!canvas || !ctx) return;
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const animationColors = getAnimationColors();
    if (mouse.x !== null && mouse.y !== null) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2, false);
        ctx.fillStyle = animationColors.particle;
        ctx.fill();
    }
    if (particlesArray) {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }
    connectParticles();
}

function resizeCanvasLogic() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (particlesArray && particlesArray.length > 0) {
        initParticles();
    }
}

export function initParticleAnimation() {
    console.log("DEBUG: ParticleAnimation called");

    if (!canvas) {
        console.error("Canvas element not found for particle animation.");
        return;
    }
    resizeCanvasLogic(); // Initial resize
    window.addEventListener('resize', resizeCanvasLogic);

    initParticles();
    animate();

    window.addEventListener('mousemove', (event) => { mouse.x = event.clientX; mouse.y = event.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
    
    return initParticles; // Возвращаем initParticles для использования в themeManager
}