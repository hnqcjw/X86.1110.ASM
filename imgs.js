/*
imgs.js
credits to kontra.js
developed by hnqcjw
*/

const {
    init,
    initPointer,
    Sprite,
    GameLoop,
    keyPressed,
    collides,
    Button
} = kontra;
import {
    updateMovement,
    getXmap,
    getYmap,
    state
} from './controls.js';
import {
    playSound
} from './extraStuff.js';

const canvas = document.getElementById('cnvs');
const {
    context
} = init(canvas);

export let storedValue = localStorage.getItem('value');
export let level = Number(storedValue);

let fixSpriteClicked = false;

const errorImage = new Image();
errorImage.src = 'error.png'

const mapImage = new Image();
if (level === 20) {
    if (navigator.platform.toLowerCase().includes('mac')) {
        mapImage.src = 'celebrateM.png'
    } else {
        mapImage.src = 'celebrateW.png'
    }
} else {
    mapImage.src = 'map.png';
}

const glitchedImage = new Image();
glitchedImage.src = 'glitched.png';

const playerImage = new Image();
playerImage.src = 'stand.png';

const fixImage = new Image();
fixImage.src = 'fix.png'

export let stuckup = 0;
export let stuckdown = 0;
export let stuckright = 0;
export let stuckleft = 0;
export let battlemode = 0;
export let victory = 0;

initPointer();
let clonesRendered = 0;
let renderFix = 1;
let timesFixed = 0;

if (level === 20) {
    console.log("%c🎉 Nice, you read the message. Here's some secrets — don't tell anyone! 🤫", "color: gold; font-size: 16px; font-weight: bold;");
    console.log("You can now choose what level you're on. Here's how:");

    console.log("%clocalStorage.setItem('value', 20);", "color: lightblue;");
    console.log("↑ Copy and paste that into the console, but replace 20 with any level number you want — 5, 13, whatever!");
    console.log("and type R to refresh, it'll get you into the level!")

    console.log("\nYou might've noticed already, but there's no more glitches! if you want to fight some more, just press F!")
    console.log("\nAlso, now that you've beaten the game, you can go wherever you want!");
    console.log("If you were ever curious what's outside the boundaries... now you can find out.");
    console.log("(There might not be anything out there, but who knows?)");
    console.log("\nAnd if you ever get lost,")
    console.log("type R, it'll refresh the page and take you back to the middle!")

    console.log("\nAnd last but not least — %cinvincibility! 🛡️", "color: limegreen; font-weight: bold;");
    console.log("While you're pressing the \"i\" key, you're fully invincible against glitches!");
    console.log("But heads up: if you're holding 'i' when entering a fight, it might not trigger properly.");
    console.log("So just let go of 'i' to enter a fight, then press it once you're in!");

    console.log("\n%cThank you for fixing this crash. -the guy");
    console.log("P. S. I'm a man of my word, go out a little bit, you'll see cakes")
}

// Promise for loading all Images
Promise.all([
    new Promise(resolve => mapImage.onload = resolve),
    new Promise(resolve => playerImage.onload = resolve),
    new Promise(resolve => glitchedImage.onload = resolve),
    new Promise(resolve => errorImage.onload = resolve)
]).then(() => {

    let opqe = 1;

    const mapSprite = Sprite({
        x: 0,
        y: 0,
        image: mapImage,
        scaleX: 10,
        scaleY: 10,
        anchor: {
            x: 0.5,
            y: 0.5
        },
    });

    const errorSprite = Sprite({
        x: 0,
        y: Math.floor(Math.random() * (300 - (0)) + (0)),
        image: errorImage,
        anchor: {
            x: 0.5,
            y: 0.5
        },
        dx: 10 + (level / 2),
        scaleX: 10,
        scaleY: 10,
        width: errorImage.width,
        height: errorImage.height
    })
    const glitchedSprite = Sprite({
        x: 100,
        y: 100,
        height: 10,
        width: 10,
        scaleX: 10,
        scaleY: 10,
        image: glitchedImage,
        anchor: {
            x: 0.5,
            y: 0.5
        },
    });

    function fix() {
        clones.length = 0;
        clonesRendered = 0;
        stopRendering();
    }


    function stopRendering() {
        renderFix = 0;
        setTimeout(() => {
            renderFix = 1;
        }, 8000);
    }

    const fixSprite = Button({
        x: canvas.width / 2,
        y: canvas.height / 2,
        scaleX: 5,
        scaleY: 5,
        image: fixImage,
        onDown: function() {
            fix();
            fixSpriteClicked = true;
            timesFixed++
            fixSprite.opacity = 0.1;
            console.log(timesFixed);

            if (timesFixed === 4) {
                victory = 1;
                if (level !== 20) {
                    level++;
                } else {
                    level = 20
                }
                localStorage.setItem('value', level + '');
                playSound("victory.ogg");
                setTimeout(() => {
                    victory = 0;
                    location.reload();
                }, 1000);
                fixSpriteClicked = false;
            }
        }
    })

    function cloneSprite() {
        return Sprite({
            x: Math.random() * (5420 - -4100) + -4100,
            y: Math.random() * (3930 - -3100) + -3100,
            scaleX: 30,
            scaleY: 30,
            anchor: {
                x: 0.5,
                y: 0.5
            },
            image: glitchedImage,
        });
    }

    opqe = 0.5

    function battleClone() {
        return Sprite({
            x: Math.random() * (1420 - (-38)) + (-38),
            y: canvas.height / 2,
            scaleX: 15,
            scaleY: 100,
            anchor: {
                x: 0.5,
                y: 0.5
            },
            image: glitchedImage,
            opacity: opqe,
        });
    }


    const playerSprite = Sprite({
        x: canvas.width / 2,
        y: canvas.height / 2,
        scaleX: 10,
        scaleY: 10,
        image: playerImage,
        anchor: {
            x: 0.5,
            y: 0.5
        },
        opacity: 1,
    });

    const clones = [];

    if (battlemode === 0) {
        for (let i = 0; i < 20 - level; i++) {
            clones.push(cloneSprite());
        }
        clonesRendered = clones.length;
    }

    let intervalStarted = false;
    let battleStarted = false;

    function direction() {
        if (keyPressed('d')) {
            playerSprite.scaleX = 10;
            playerImage.src = "run.png";
        } else if (keyPressed('a')) {
            playerSprite.scaleX = -10;
            playerImage.src = "run.png";
        } else {
            playerImage.src = "stand.png";
        }
    }

    function costumes() {
        if (keyPressed('w') || keyPressed('s') || keyPressed('a') || keyPressed('d')) {
            playerImage.src = "run.png";
        } else {
            playerImage.src = "stand.png";
        }
        if (keyPressed('r')) {
            location.reload();
        }
        if (keyPressed('f') && level === 20) {
            battlemode = 1
        }
    }

    function checkx() {
        if (level !== 20) {
            if (mapSprite.x > 5420) {
                stuckright = 1;
                stuckleft = 0;
            }
            else if (mapSprite.x < -4000) {
                stuckleft = 1;
                stuckright = 0;
            }
            else {
                stuckright = 0;
                stuckleft = 0;
            }
        }
    }

    function checky() {
        if (level !== 20) {
            if (mapSprite.y > 3930) {
            	stuckup = 1; stuckdown = 0;
            }
            else if (mapSprite.y < -3100) {
            	stuckdown = 1; stuckup = 0;
            }
            else {
            	stuckup = 0; stuckdown = 0;
            }
        }
    }

    function checkEdgeX() {
        if (playerSprite.x < -60) {
            playerSprite.x = 1450;
        } else if (playerSprite.x > 1450) {
            playerSprite.x = -60;
        }
    }

    function checkEdgeY() {
        if (playerSprite.y < -104) {
            playerSprite.y = 868;
        } else if (playerSprite.y > 868) {
            playerSprite.y = -104;
        }
    }

    let loopedAround = 0;
    let invincible = 0;

    const loop = GameLoop({
        update() {
            updateMovement();
            checkEdgeX();
            checkEdgeY();
        	if (battlemode === 1 && !battleStarted) {
                battleStarted = true;
                loopedAround = 0
                clones.length = 0;
                clonesRendered = clones.length;

                setInterval(() => {
                    opqe = 0.5

                    clones.push(battleClone());
                    clonesRendered++;

                    setTimeout(() => {
                        opqe = 1;
                        errorSprite.x = 0
                        errorSprite.y = Math.floor(Math.random() * (300 - (0)) + (0))
                        loopedAround = 1;
                    }, 1000 / (level + 1));
                }, 4000 - level * 100);
            }

            if (battlemode === 1) {
                clones.slice(0, clonesRendered).forEach(clone => {
                    const collidedWithClone = collides(playerSprite, clone) && opqe === 1;
                    const collidedWithError = collides(playerSprite, errorSprite);

                    if ((collidedWithClone || collidedWithError) && invincible === 0) {
                        if (!(level === 20 && keyPressed('i'))) {
                            invincible = 1;
                            state.hp -= 10;
                            if (state.hp === 0) {
                                if (level !== 0) {
                                    level--;
                                }
                                localStorage.setItem('value', level)
                                location.reload();
                            }
                            playSound("untitled.ogg");
                            setTimeout(() => invincible = 0, 500);
                        }
                    }
                    if (invincible === 1) {
                        playerSprite.opacity = 0.5;
                    } else {
                        playerSprite.opacity = 1;
                    }
                    clone.opacity = opqe;
                    clone.update();
                });
            }


            let data = document.getElementById("loc");
            if (keyPressed('1')) {
                data.textContent = `x: ${mapSprite.x} y: ${mapSprite.y}\nHP: ${state.hp} Level: ${level}`;
            } else {
                data.textContent = "";
            }
            if (battlemode === 0) {
                glitchedSprite.x += getXmap();
                glitchedSprite.y += getYmap();

                mapSprite.x += getXmap();
                mapSprite.y += getYmap();

                clones.slice(0, clonesRendered).forEach(clone => {
                    clone.x += getXmap();
                    clone.y += getYmap();
                    clone.update();

                    if (collides(playerSprite, clone)) {
                        if (!battlemode) {
                            battlemode = 1;
                            fix();
                            timesFixed = 0;
                        }
                    }
                });

            } else {
                playerSprite.dx = -getXmap() / 1.5;
                playerSprite.dy = -getYmap() / 1.5;
                errorSprite.update();
            }

            mapSprite.update();
            playerSprite.update();
            fixSprite.update();
            direction();
            costumes();
            checkx();
            checky();
        },

        render() {
            mapSprite.render();
            if (battlemode === 0) {
                clones.forEach(clone => clone.render());
            } else {
                clones.slice(0, clonesRendered).forEach(clone => clone.render());
                if (loopedAround === 1) {
                    errorSprite.render();
                }
            }

            playerSprite.render();

            if (renderFix === 1 && battlemode === 1 && !fixSpriteClicked) {
                fixSprite.render(); // Render fixSprite only if not clicked
            }
        }
    });

    loop.start();
});
