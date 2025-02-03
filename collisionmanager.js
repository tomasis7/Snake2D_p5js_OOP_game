"use strict";
class CollisionManager {
    constructor(players, entities, scoreManager, removeEntityCallback) {
        this.players = players;
        this.entities = entities;
        this.scoreManager = scoreManager;
        this.removeEntityCallback = removeEntityCallback;
    }
    handleTetrisCollision(player) {
        sounds.blockCollision.play();
        if (music.backgroundMusic.isPlaying()) {
            music.backgroundMusic.stop();
        }
        player.isColliding = true;
        player.isMoving = false;
        console.log(`Player ${player.playerNumber} collided with a TetrisBlock.`);
        this.showGameOver(player.playerNumber);
    }
    handleBlockCollision(player) {
        sounds.wallCollision.play();
        if (music.backgroundMusic.isPlaying()) {
            music.backgroundMusic.stop();
        }
        player.isColliding = true;
        player.isMoving = false;
        console.log(`Player ${player.playerNumber} collided with a TetrisBlock.`);
        this.showGameOver(player.playerNumber);
    }
    handleWinBlockCollision(player) {
        sounds.goalline.play();
        if (music.backgroundMusic.isPlaying()) {
            music.backgroundMusic.stop();
        }
        player.isColliding = true;
        player.isMoving = false;
        console.log(`Player ${player.playerNumber} won!`);
        const otherPlayerNumber = player.playerNumber === 1 ? 2 : 1;
        this.showGameOver(otherPlayerNumber);
    }
    handleStarCollision(player, star) {
        if (star.isRemoved)
            return;
        sounds.starPickUp.play();
        player.isColliding = true;
        player.scoreMultiplier = 2;
        const scoreInterval = setInterval(() => {
            this.scoreManager.updateScore(player.getPlayerNumber(), 50 * player.scoreMultiplier);
        }, 1000);
        setTimeout(() => {
            player.scoreMultiplier = 1;
            clearInterval(scoreInterval);
            console.log(`Player ${player.playerNumber}'s score multiplier reset.`);
        }, 10000);
        star.isRemoved = true;
        this.removeEntityCallback(star);
        console.log(`Star entity removed:`, star);
    }
    handleHeartCollision(player, heart) {
        if (heart.isRemoved)
            return;
        sounds.gainheart.play();
        player.isColliding = true;
        console.log(`Player ${player.playerNumber} collected a Heart!`);
        if (player.lives < player.maxLives) {
            player.lives += 1;
        }
        heart.isRemoved = true;
        this.removeEntityCallback(heart);
        console.log(`Heart entity removed:`, heart);
    }
    handlePlantCollision(player) {
        const currentTime = Date.now();
        if (currentTime - player.lastCollisionTime < player.collisionCooldown) {
            return;
        }
        player.lastCollisionTime = currentTime;
        console.log(`Player lives before collision: ${player.lives}`);
        sounds.blockCollision.play();
        player.isColliding = true;
        player.lives -= 2;
        console.log(`Player lives after collision: ${player.lives}`);
        if (player.lives < 0) {
            player.lives = 0;
        }
        if (player.lives <= 0) {
            if (music.backgroundMusic.isPlaying()) {
                music.backgroundMusic.stop();
            }
            this.showGameOver(player.playerNumber);
        }
    }
    handleGhostProximity(player, ghost) {
        const distance = dist(player.trail[0].x, player.trail[0].y, ghost.position.x, ghost.position.y);
        if (distance < 200) {
            console.log("Ghost is near, playing sound...");
            if (!ghost.isSoundPlaying) {
                sounds.ghost.play();
                ghost.isSoundPlaying = true;
                console.log("Ghost sound started");
            }
            else {
                if (ghost.isSoundPlaying) {
                    sounds.ghost.stop();
                    ghost.isSoundPlaying = false;
                    console.log("Ghost sound stopped");
                }
            }
        }
    }
    handleGhostCollision(player) {
        const currentTime = Date.now();
        if (currentTime - player.lastCollisionTime > 2000) {
            player.isColliding = true;
            player.lives -= 1;
            if (player.lives < 0) {
                player.lives = 0;
            }
            if (player.lives === 0) {
                this.showGameOver(player.playerNumber);
            }
            this.scoreManager.updateScore(player.getPlayerNumber(), -5);
            player.lastCollisionTime = currentTime;
        }
    }
    checkCollision() {
        for (const player of this.players) {
            const head = player.trail[0];
            const headLeft = head.x;
            const headRight = head.x + player.size.x;
            const headTop = head.y;
            const headBottom = head.y + player.size.y;
            let hasCollision = false;
            for (const entity of this.entities) {
                if (entity instanceof Ghost) {
                    this.handleGhostProximity(player, entity);
                }
                const entityLeft = entity.position.x;
                const entityRight = entity.position.x + entity.size.x;
                const entityTop = entity.position.y;
                const entityBottom = entity.position.y + entity.size.y;
                const isColliding = headRight > entityLeft &&
                    headLeft < entityRight &&
                    headBottom > entityTop &&
                    headTop < entityBottom;
                if (isColliding) {
                    hasCollision = true;
                    if (!player.isColliding) {
                        if (entity instanceof TetrisBlock) {
                            this.handleTetrisCollision(player);
                        }
                        else if (entity instanceof Block) {
                            this.handleBlockCollision(player);
                        }
                        else if (entity instanceof Star) {
                            this.handleStarCollision(player, entity);
                        }
                        else if (entity instanceof Heart) {
                            this.handleHeartCollision(player, entity);
                        }
                        else if (entity instanceof Plant) {
                            this.handlePlantCollision(player);
                        }
                        else if (entity instanceof Ghost) {
                            this.handleGhostCollision(player);
                        }
                        else if (entity instanceof WinBlock) {
                            this.handleWinBlockCollision(player);
                        }
                        break;
                    }
                }
                if (!hasCollision) {
                    player.isColliding = false;
                }
            }
        }
    }
    showGameOver(losingPlayer) {
        const winnerMessage = losingPlayer === 1
            ? " - Player 2"
            : losingPlayer === 2
                ? " - Player 1"
                : "Game Over!";
        game.changeScreen(new GameOverScreen(winnerMessage, this.scoreManager));
        console.log(winnerMessage);
    }
    showPopupMessage(message, duration = 3000) {
        const popup = document.createElement("div");
        popup.innerText = message;
        popup.style.position = "absolute";
        popup.style.top = "10px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        popup.style.color = "white";
        popup.style.padding = "10px 20px";
        popup.style.borderRadius = "8px";
        popup.style.zIndex = "1000";
        document.body.appendChild(popup);
        setTimeout(() => {
            document.body.removeChild(popup);
        }, duration);
    }
}
//# sourceMappingURL=collisionmanager.js.map