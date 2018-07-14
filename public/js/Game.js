function Game(data) {

    this.width = data.width;
    this.height = data.height;

    this.ball = new Ball(data.ball.x, data.ball.y, data.ball.radius);
    this.paddle = new Paddle(data.paddle.width, data.paddle.height, data.paddle.x, data.paddle.y);
    this.oppPaddle = new Paddle(data.oppPaddle.width, data.oppPaddle.height, data.oppPaddle.x, data.oppPaddle.y);
    
    this.player1 = {name: data.player1.name, score: 0};
    this.player2 = {name: data.player2.name, score: 0};

    canvas._canvasDOM.width = this.width;
    canvas._canvasDOM.height = this.height;
    canvas.y = data.paddle.y;
}

Game.prototype.update = function() {
    
    this.paddle.y = canvas.y - this.paddle.height / 2;

    canvas.clear();
    
    canvas.drawText(this.player1.name, this.width / 4, 0, 32, 'center', 'top');
    canvas.drawText(this.player2.name, 3* this.width / 4, 0, 32, 'center', 'top');

    canvas.drawText(this.player1.score, this.width / 4, this.height / 2, 72, 'center', 'middle');
    canvas.drawText(this.player2.score, 3* this.width / 4, this.height / 2, 72, 'center', 'middle');

    this.ball.draw();
    this.paddle.draw();
    this.oppPaddle.draw();
}