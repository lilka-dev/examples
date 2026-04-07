// particles.js — модуль частинок, завантажується через load()

let particles = [];
let maxParticles = 30;

function spawnParticle(x, y) {
    if (particles.length >= maxParticles) {
        // Видаляємо найстарішу частинку
        let newArr = [];
        let i = 1;
        while (i < particles.length) {
            newArr.push(particles[i]);
            i++;
        }
        particles = newArr;
    }
    particles.push({
        x: x,
        y: y,
        vx: math.random(-3, 3),
        vy: math.random(-5, -1),
        life: math.random(20, 50),
        color: randomColor(),
        size: math.random(2, 5)
    });
}

function updateParticles() {
    let alive = [];
    let i = 0;
    while (i < particles.length) {
        let p = particles[i];
        p.x = p.x + p.vx;
        p.y = p.y + p.vy;
        p.vy = p.vy + 0.15; // гравітація
        p.life = p.life - 1;
        if (p.life > 0) {
            alive.push(p);
        }
        i++;
    }
    particles = alive;
}

function drawParticles() {
    let i = 0;
    while (i < particles.length) {
        let p = particles[i];
        display.fill_circle(
            math.round(p.x),
            math.round(p.y),
            p.size,
            p.color
        );
        i++;
    }
}
