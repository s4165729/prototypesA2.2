//same 8 note scale as the first dot prototype,the use of distance
// picks the note her instead of the x/y 

const SCALE = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
const startButton = document.getElementById('s');
const message = document.getElementById('m');
const field = document.getElementById('f');

let ctx;
let tx, ty; 
let found = true; 
let nextPing = 0; 
let raf; 
// so pointer position is kept up to date by pointermove 
let lastX = 0.5, lastY = 0.5, boxW = 1, boxH = 1;

startButton.onclick = () => {
    ctx = ctx || new AudioContext();
    tx = Math.random();
    ty = Math.random();
    found = false; 
    message.textContent = '';
    nextPing = 0;
};

field.onpointermove = e => {
    const r = field.getBoundingClientRect();
    boxW = r.width;
    boxH = r.height;
    lastX = (e.clientX - r.left) / r.width;
    lastY = (e.clientY - r.top) / r.height;
};

//adding loop function than pointermove, so it says more
// accurate even if you pause it 
function loop() {
    raf = requestAnimationFrame(loop);
    if (!ctx || found) return;

    const now = ctx.currentTime;
    if (now <nextPing) return;
//distance is an actual circle rather than a squashed ellipse one a wide box
const dxPx = (tx - lastX) *boxW
const 
}