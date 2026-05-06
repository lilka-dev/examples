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
            i = i + 1;
        }
        particles = newArr;
    }
    particles.push({
        x: x,
        y: y,
        vx: math.random(0 - 3, 3),
        vy: math.random(0 - 5, 0 - 1),
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
        p.vy = p.vy + 0.15;
        p.life = p.life - 1;
        if (p.life > 0) {
            alive.push(p);
        }
        i = i + 1;
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
        i = i + 1;
    }
}
