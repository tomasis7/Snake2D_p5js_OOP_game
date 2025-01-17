// Main Game Class
class Game {
  private activeScreen: GameScreen[];
  constructor() {
    this.activeScreen = [new GameBoard()];
  }
  changeScreen(): void {
    // Logic to change the screen
  }
  newGame(): void {
    // Logic to start a new game
  }
  draw(): void {
    // Draw the current active screen
    for (const screen of this.activeScreen) {
      screen.draw();
    }
  }
  end(): void {
    //     // Logic to end the game
  }
}
// // Collision Manager
// class CollisionManager {
//   players: Player[];
//   entities: Entity[];
//   constructor() {
//     this.players = [];
//     this.entities = [];
//   }
//   checkCollision(player: Player, gameBoard: GameBoard): boolean {
//     // Check for collisions between players and entities
//     return false;
//   }
//   draw(): void {
//     // Visual representation of collisions, if needed
//   }
// }

// Game Board
class GameBoard {
  entities: Entity[];
  //collision: CollisionManager;
  //score: ScoreManager[];

  constructor() {
    this.entities = [new Star()];
    //this.collision = new CollisionManager();
    //this.score = [];
  }

  addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  removeEntity(entity: Entity): void {
    this.entities = this.entities.filter((e) => e !== entity);
  }

  draw(): void {
    for (const entity of this.entities) {
      entity.draw();
    }
  }
}

// // Score Manager
// class ScoreManager {
//   scores: Map<Player, number>;

//   constructor() {
//     this.scores = new Map();
//   }

//   addScore(player: Player, score: number): void {
//     const currentScore = this.scores.get(player) || 0;
//     this.scores.set(player, currentScore + score);
//   }

//   draw(): void {
//     // Draw the score UI
//   }
// }

// Screen Base Class
// abstract class Screen {
//   abstract update(): void;
//   abstract draw(): void;
// }

// // Start Menu
// class StartMenu extends Screen {
//   startGameButton: Button;

//   constructor(button: Button) {
//     super();
//     this.startGameButton = button;
//   }

//   update(): void {
//     // Update start menu logic
//   }

//   draw(): void {
//     this.startGameButton.draw();
//   }
// }

// // Game Over Screen
// class GameOver extends Screen {
//   restartButton: Button;

//   constructor(button: Button) {
//     super();
//     this.restartButton = button;
//   }

//   update(): void {
//     // Update game over logic
//   }

//   drawTitle(): void {
//     // Draw the "Game Over" title
//   }

//   draw(): void {
//     this.restartButton.draw();
//   }
// }

// // Count Down
// class CountDown extends Screen {
//   draw(): void {
//     // Draw countdown screen
//   }

//   update(): void {
//     // Update countdown logic
//   }
// }

// Level Factory
class LevelFactory {
  private gridSize: number = 32;

  draw(): void {
    // Draw level creation elements
    push();
    stroke(150, 150, 150);
    strokeWeight(2);
    for (let x = 0; x < width * 2; x += this.gridSize) {
      line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += this.gridSize) {
      line(0, y, width * 2, y);
    }
    pop();
  }
}

// IMovable Interface

// // Player Class
// class Player implements IMovable {
//   position: p5.Vector;
//   direction: p5.Vector;
//   trail: p5.Vector[];

//   constructor(position: p5.Vector, direction: p5.Vector) {
//     this.position = position;
//     this.direction = direction;
//     this.trail = [];
//   }

//   move(): void {
//     // Move the player
//   }

//   update(): void {
//     // Update the player's position and state
//   }
// }

// // Button Class
// class Button {
//   text: string;
//   position: p5.Vector;
//   backgroundColor: string;
//   size: p5.Vector;
//   color: string;

//   constructor(
//     text: string,
//     position: p5.Vector,
//     backgroundColor: string,
//     size: p5.Vector,
//     color: string
//   ) {
//     this.text = text;
//     this.position = position;
//     this.backgroundColor = backgroundColor;
//     this.size = size;
//     this.color = color;
//   }

//   draw(): void {
//     // Draw button UI
//   }
// }
