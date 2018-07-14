const WIDTH = 1280;
const HEIGHT = 720;
const BALLRADIUS = 15;
const PADDLEWIDTH = 20;
const PADDLEHEIGHT = 100;

var num = 0;

function Game(player1Id, player2Id) {

    this.id = ++num;

    this.width = WIDTH;
    this.height = HEIGHT;

    this.ball = {
        x: WIDTH / 2,
        y: HEIGHT / 2,
        dx: 10.0 * (Math.random() < 0.5 ? -1 : 1),
        dy: 0.0,
        radius: BALLRADIUS
    };

    this.player1 = {
        id: player1Id,
        score: 0,
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        x: PADDLEWIDTH,
        y: HEIGHT / 2 - PADDLEHEIGHT / 2
    };

    this.player2 = {
        id: player2Id,
        score: 0,
        width: PADDLEWIDTH,
        height: PADDLEHEIGHT,
        x: WIDTH - 2 * PADDLEWIDTH,
        y: HEIGHT / 2 - PADDLEHEIGHT / 2
    };

}

Game.prototype.update = function() {

    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    if (this.ball.y <= this.ball.radius || this.ball.y + this.ball.radius >= this.height) {
        
        let offset = this.ball.dy > 0 ? this.height - this.ball.y - this.ball.radius : this.ball.radius - this.ball.y;
        this.ball.y += 2 * offset;

        this.ball.dy *= -1;
        
    }

    let paddle = this.ball.dx > 0 ? this.player2 : this.player1;

    if (this.ball.x + this.ball.radius >= paddle.x &&
        this.ball.y + this.ball.radius >= paddle.y &&
        this.ball.x <= paddle.x + paddle.width + this.ball.radius &&
        this.ball.y <= paddle.y + paddle.height + this.ball.radius) {

        let n = (this.ball.y + this.ball.radius - paddle.y) / (paddle.height + 2 * this.ball.radius);
        let phi = 0.25 * Math.PI * (2 * n - 1);

        let smash = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;

        let offset = this.ball.dx > 0 ? paddle.x - this.ball.x - this.ball.radius : paddle.x + paddle.width + this.ball.radius - this.ball.x;
        this.ball.x += 2 * offset;

        let speed = Math.sqrt(this.ball.dx ** 2 + this.ball.dy ** 2);
        this.ball.dx = smash * (this.ball.dx > 0 ? -1 : 1) * speed * Math.cos(phi);
        this.ball.dy = smash * speed * Math.sin(phi);

    }

    if (this.ball.x >= this.width || this.ball.x <= this.ball.radius) {

        this.ball.dx > 0 ? this.player1.score++ : this.player2.score++;

        this.ball.x =  WIDTH / 2;
        this.ball.y =  HEIGHT / 2;
        this.ball.dx =  10.0 * (Math.random() < 0.5 ? -1 : 1);
        this.ball.dy =  0.0;

    }
    
}

module.exports = Game