import { Application } from 'pixi.js';
import { PIXI_APP_BG_COLOR } from './consts/CColor';
import { Game } from './Game';

export const app = new Application();
(globalThis as any).__PIXI_APP__ = app;

function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    app.renderer.canvas.style.width = `${windowWidth}px`;
    app.renderer.canvas.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);
    app.renderer.resize(windowWidth, windowHeight);
}

async function init() {
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: PIXI_APP_BG_COLOR,
    });

    document.body.appendChild(app.canvas);
    window.addEventListener('resize', resize);
    resize();

    new Game(app);
}

window.onload = () => {
    init();
};