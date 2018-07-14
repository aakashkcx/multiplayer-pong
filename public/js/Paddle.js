function Paddle(width, height, x, y) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

}

Paddle.prototype.draw = function() {

    canvas.drawRect(this.x, this.y, this.width, this.height);
    
}