
/**
* This is the enemies in the game, if player collides with an enemy, he dies.
* The speed of the enemy is a random value
* @constructor
* @param {integer} x - x position of the enemy on the screen
* @param {integer} y - y position of the enemy on the screen
* @param {integer} velocity - speed of the enemy which is randomly generated
*/

var Enemy = function(x, y, velocity) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png'; // sprite is the image of the enemy to be loaded
    this.x = x;
    this.y = y;
    this.velocity = Math.floor((Math.random() * 500) + 100);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.velocity * dt; // speed is the same on all computers
    if (this.x > 500) { // whenever a bug reaches the right edge
        this.x = -100; // a new bug appears at the left edge
        this.velocity = Math.floor((Math.random() * 500) + 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* Player Class - This defines the chatacter that the player plays with
* @constructor
* @param {integer} x - x position of the player on the screen
* @param {integer} y - y position of the player on the screen
* @param {integer} lives - lives of the player when it is 0 the game ends
* @param {integer} score - score of the player when it is 150 player wins the game
*/

var Player = function(x, y, lives, score) {

    this.sprite = 'images/char-boy.png';  // sprite changes with the selection of the player
    this.x = x;
    this.y = y;
    this.lives = lives;
    this.score = score;
};

// Behavior on reaching water, colliding with a bug, collecting a star
Player.prototype.update = function() {
    if (this.y <= 50) { // when player reaches the edge of the water
        this.y = 404; // player's position on vertical axis is reset
        this.score += 10; // user's score increases
    }
};

// changes the Appearance of the player with the selection of the player
Player.prototype.changeSprite = function(ch) {
    if (ch == 0) {
        this.sprite = 'images/char-boy.png';
    }

    else if (ch == 1) {
        this.sprite = 'images/char-cat-girl.png';
    }

    else if (ch == 2) {
        this.sprite = 'images/char-horn-girl.png';
    }

    else if (ch == 3) {
        this.sprite = 'images/char-pink-girl.png';
    }

    else if (ch == 4) {
        this.sprite = 'images/char-princess-girl.png';
    }
}

// Rendering of the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.drawText(); // score is printed on the screen
};

// How the user controls the player, using arrow keys
Player.prototype.handleInput = function(key) {

    var horizontalStep = 101;
    var verticalStep = 83;

    if (key === 'up' && this.y > 50) {
        this.y -= verticalStep;
    } else if (key === 'down' && this.y < 350) {
        this.y += verticalStep;
    } else if (key === 'left' && this.x > 40) {
        this.x -= horizontalStep;
    } else if (key === 'right' && this.x < 400) {
        this.x += horizontalStep;
    }
};

// User score and player lives on collision with an enemy bug
Player.prototype.collision = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (collide(this, allEnemies[i])) {
            this.lives -= 1; // player loses a life
            this.y = 404; // player's vertical location is reset
        }
    }
};

// After the game is over redraw the player
Player.prototype.reset = function() {
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.lives = 3;
}

/**
* Star class that updates, renders stars.
* @constructor
*
*/

// Appearance and starting position, using the formula below
var Star = function(){
    this.sprite = 'images/star.png';
    this.x = 0;
    this.y = 83;
};


// How each star is drawn on the screen
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log("star is drawn!!");
};

// Player collides with star
Star.prototype.collision = function() {
    if (collide(this, player)) {
        this.x = colWidth * Math.floor(Math.random()*4);
        this.y = rowHeight * (Math.floor(Math.random()*4)+1);

        player.score += 5;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = new Array();
for (var i = 0; i < 4; i++) {
    allEnemies.push(new Enemy(-100, 60 + (83 * i)));
}
var player = new Player(1, -1, 3, 0);
var star = new Star();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// collide function to see if a and b collides
function collide(a,b){
    return  a.x < (b.x + 50) &&
         (a.x + 50) > b.x &&
          a.y < (b.y + 50) &&
          (a.y + 50) > b.y;
}

 var colWidth = 101, rowHeight = 83;

/* Text showing user score, player lives, and simplified instructions;
parts of it is taken from internet */

Player.prototype.drawText = function() {
    ctx.fillStyle = '#333333';
    ctx.font = '30px Boogaloo';
    ctx.clearRect(0, 0, 600, 40);
    ctx.fillText('Score  ' + this.score, 10, 30);
    ctx.clearRect(420, 0, 160, 40);
    ctx.fillText('Lives  ' + this.lives, 320, 30);
    ctx.font = 'bold 12px Arial';
    ctx.clearRect(0, 601, 505, 656);
    ctx.fillText('Use the arrow keys to move your player. ' +
        'You’ll get 10 points for reaching the water and', 0, 611);
    ctx.fillText('5 points for collecting a star. ' +
        'You will win at 150 points. Good luck!', 0, 631);

};
