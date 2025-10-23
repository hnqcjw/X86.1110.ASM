const audioElement = document.getElementById("background-music");
let currentSong = "";
const audioElement2 = document.getElementById("sfx");
let currentSfx = "";

export function switchSong(newSong) {
    if (audioElement.src.includes(newSong)) return;
    audioElement.src = newSong;
    audioElement.load();
    audioElement.play().catch(() => {});
}

const soundCache = {};

export function playSound(soundFile) {
    if (!soundCache[soundFile]) {
        soundCache[soundFile] = new Audio(soundFile);
    }
    const sound = soundCache[soundFile];
    sound.currentTime = 0;
    sound.play().catch(() => {});
}


import * as gameState from './imgs.js';
setInterval(() => {
    if (gameState.battlemode === 1 && currentSong !== "FIGHT.ogg") {
        switchSong("FIGHT.ogg");
        currentSong = "FIGHT.ogg";
    } else if (gameState.battlemode === 0 && currentSong !== "chillFlux.ogg" && gameState.level === 20) {
        switchSong("celebrate.ogg");
        currentSong = "celebrate.ogg";
    } else if (gameState.battlemode === 0 && currentSong !== "chillFlux.ogg" && gameState.level !== 20) {
        switchSong("chillFlux.ogg");
        currentSong = "chillFlux.ogg";
    }

    if (gameState.victory === 1 && currentSfx !== "victory.ogg") {
        currentSfx = "victory.ogg";
    }
}, 100);
