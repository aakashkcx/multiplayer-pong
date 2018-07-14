function Ball(x, y, radius) {

    this.x = x;
    this.y = y;
    this.radius = radius;

}

Ball.prototype.draw = function() {

    canvas.drawCircle(this.x, this.y, this.radius);
    
}