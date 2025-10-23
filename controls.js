/*
controls.js
including kontra.js
developed by hnqcjw
*/

const {
    initKeys,
    keyPressed
} = kontra;
import {
    stuckup,
    stuckdown,
    stuckleft,
    stuckright
} from './imgs.js';

initKeys();

let xmap = 0;
let ymap = 0;

export let hp = 100;

export const state = {
    hp: 100
};

export function updateMovement() {
    if (keyPressed('d') && stuckleft === 0) {
        xmap = -10;
    } else if (keyPressed('a') && stuckright === 0) {
        xmap = 10;
    } else {
        xmap = 0;
    }
    if (keyPressed('s') && stuckdown === 0) {
        ymap = -10;
    } else if (keyPressed('w') && stuckup === 0) {
        ymap = 10;
    } else {
        ymap = 0
    }
}

export function getXmap() {
    return xmap;
}

export function getYmap() {
    return ymap;
}
