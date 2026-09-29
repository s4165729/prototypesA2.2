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
const dxPx = (tx - lastX) *boxW;
const dyPx = (ty - lastY) * boxH;
const dPx = Math.hypot(dxPx, dyPx);
const maxDist = Math.hypot(boxW, boxH); 
const hitRadius = Math.min(boxW, boxH) * 0.12;

if (dPx < hitRadius) {
    found = true;
    playChord(); 
    message.textContent = 'found it! press start to play again';
    return;
}

const closeness = 1 - Math.min(dPx / (maxDist * 0.5),1); //0 far 1 near taget
const note = SCALE[Math.min(SCALE.length-1, Math.floor(closeness * SCALE.length))];
const pan = Math.max(-1, Math.min(1, dxPx / (boxW * 0.3)));

Ping(note, pan);
// faster pings the closer you get to the target
//700ms far 120 right ontop

nextPing = now + (0.7 - closeness * 0.58);
}

raf = requestAnimationFrame(loop);
//plays a single short blip at the given freaqency 
function ping(freq.pan) {
    const t = ctx.currentTime;
    const o = ctx.create0scillator();
    const g = ctx.createGain();
    const p = ctx.createStereoPanner();

    o.frequency.value = freq;
    p.pan.value = pan;

    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    o.connect(g). connect(p).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.18);
}
//plays a short rising chord to confirm the target was found to the user
function playChord() {
    [523.25, 659.25, 783.98].forEach((freq,i) => {
        const t = ctx.currentTime + i * 0.06;
        const o = ctx.create0scillator();
        const g = ctx.createGain();

        o.frequency.value = freq;
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        o.connect(g). connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.6);
    });
}