var socket = io();
var game;
var frame;

showMenu();

$('#form').on('submit', function(e) {

    e.preventDefault();
    name = $('#form input:text').val();

    if (name.trim() == "" || name == null) {
        $('#form input:text').addClass('is-invalid');
    } else {
        $('#form input:text').removeClass('is-invalid');
        socket.emit('submit', name);
    }

});

$('#queue button').on('click', function() {
    socket.emit('queue-leave');
});

socket.on('queue-joined', showQueue);

socket.on('queue-left', showMenu);

socket.on('game-start', function(data) {
    game = new Game(data);
    showGame();
    frame = window.requestAnimationFrame(mainloop);
});

socket.on('game-update', function(data) {
    game.player1.score = data.player1.score;
    game.player2.score = data.player2.score;
    game.ball.x = data.ball.x;
    game.ball.y = data.ball.y;
    game.oppPaddle.y = data.oppPaddle.y;
});

socket.on('game-end', function() {
    showMenu();
    window.cancelAnimationFrame(frame);
});

function mainloop() {
    game.update();

    socket.emit('game-paddle-move', game.paddle.y);

    window.requestAnimationFrame(mainloop);
}

function showMenu() {
    $('#form').show();
    $('#queue').hide();
    $('#canvas').hide();
}

function showQueue() {
    $('#form').hide();
    $('#queue').show();
    $('#canvas').hide();
}

function showGame() {
    $('#form').hide();
    $('#queue').hide();
    $('#canvas').show();
}