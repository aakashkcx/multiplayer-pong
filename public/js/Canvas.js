var canvas = {};
canvas._canvas = $('#canvas')
canvas._canvasDOM = canvas._canvas.get(0);
canvas._context = canvas._canvasDOM.getContext('2d');
canvas.y = 0;

canvas._canvas.on('mousemove', function(e) {
    canvas.y = e.pageY - $(this).offset().top;
});

canvas.clear = function() {
    canvas._context.clearRect(0, 0, canvas._canvasDOM.width, canvas._canvasDOM.height);
    canvas._context.fillStyle = 'black';
    canvas._context.fillRect(0, 0, canvas._canvasDOM.width, canvas._canvasDOM.height);
};

canvas.drawCircle = function(x, y, radius) {
    canvas._context.fillStyle = 'white';
    canvas._context.beginPath();
    canvas._context.arc(x, y, radius, 0, 2 * Math.PI);
    canvas._context.fill();
    canvas._context.closePath();
};

canvas.drawRect = function(x, y, w, h) {
    canvas._context.fillStyle = 'white';
    canvas._context.fillRect(x, y, w, h);
};

canvas.drawText = function(text, x, y, size, align, baseline) {
    canvas._context.fillStyle = 'white';
    canvas._context.font = `${size}px Segoe UI`;
    canvas._context.textAlign = align;
    canvas._context.textBaseline = baseline;
    canvas._context.fillText(text, x, y);
};