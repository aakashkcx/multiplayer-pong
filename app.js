// Imports
const http = require('http');
const express = require('express');
const path = require('path');
const socket = require('socket.io');
const Game = require('./Game');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.port || 8080;

var num = 0;

var players = new Map();
var games = new Map();
var queue = [];

// Start the server
server.listen(port, () => {console.log(`server started on ${port}`)});

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {

    let player = {};
    player.id = ++num;
    player.socket = socket;
    player.name = `player#${player.id}`;
    player.inQueue = false;
    player.inGame = false;

    players.set(player.id, player);

    console.log(`${player.name} has connected - ${players.size} player(s) online`);

    socket.on('submit', (name) => {

        if (name.trim() == '' || name == null) {
            player.name = `player#${player.id}`;
        } else {
            player.name = name;
        }

        queue.push(player.id);
        player.inQueue = true;

        socket.emit('queue-joined');

        console.log(`${player.name} has joined the queue - ${queue.length} player(s) in queue`);

    });

    socket.on('queue-leave', () => {
        if (player.inQueue) {

            queue.splice(queue.indexOf(player.id), 1);
            player.inQueue = false;

            socket.emit('queue-left');

            console.log(`${player.name} has left the queue - ${queue.length} player(s) in queue`);

        }
    });

    socket.on('game-paddle-move', (data) => {
        
        try {
            if (player.inGame) {
                if (player.game.player == 1) {
                    games.get(player.game.id).player1.y = data;
                }
                if (player.game.player == 2) {
                    games.get(player.game.id).player2.y = data;
                }
            }
        } catch (error) {
            console.log(error);
        }
        
    });

    socket.on('disconnect', () => {
        
        if (player.inQueue) {
            queue.splice(queue.indexOf(player.id), 1);
        }

        if (player.inGame) {
            games.delete(player.game.id);
            players.get(player.game.oppId).socket.emit('game-end');
        }

        players.delete(player.id);
        console.log(`${player.name} has disconnected - ${players.size} player(s) online`);

    });

});

setInterval(() => {

    games.forEach((game, gameId) => {

        let player1 = players.get(game.player1.id);
        let player2 = players.get(game.player2.id);
        
        game.update();

        player1.socket.emit('game-update', {
            player1: {score: game.player1.score},
            player2: {score: game.player2.score},
            ball: {x: game.ball.x, y: game.ball.y},
            oppPaddle: {y: game.player2.y}
        });

        player2.socket.emit('game-update', {
            player1: {score: game.player1.score},
            player2: {score: game.player2.score},
            ball: {x: game.ball.x, y: game.ball.y},
            oppPaddle: {y: game.player1.y}
        });
    });

    if (queue.length >= 2) {

        let player1Id = queue.shift();
        let player2Id = queue.shift();
        let player1 = players.get(player1Id);
        let player2 = players.get(player2Id);
        player1.inQueue = false;
        player2.inQueue = false;

        let game = new Game(player1Id, player2Id);
        games.set(game.id, game);

        player1.inGame = true;
        player2.inGame = true;
        player1.game = {id: game.id, player: 1, oppId: player2Id};
        player2.game = {id: game.id, player: 2, oppId: player1Id};

        player1.socket.emit('game-start', {
            player1: {name: player1.name},
            player2: {name: player2.name},
            width: game.width,
            height: game.height,
            ball: {
                x: game.ball.x,
                y: game.ball.y,
                radius: game.ball.radius
            },
            paddle: {
                width: game.player1.width,
                height: game.player1.height,
                x: game.player1.x,
                y: game.player1.y
            },
            oppPaddle: {
                width: game.player2.width,
                height: game.player2.height,
                x: game.player2.x,
                y: game.player2.y
            }
        });

        player2.socket.emit('game-start', {
            player1: {name: player1.name},
            player2: {name: player2.name},
            width: game.width,
            height: game.height,
            ball: {
                x: game.ball.x,
                y: game.ball.y,
                radius: game.ball.radius
            },
            paddle: {
                width: game.player2.width,
                height: game.player2.height,
                x: game.player2.x,
                y: game.player2.y
            },
            oppPaddle: {
                width: game.player1.width,
                height: game.player1.height,
                x: game.player1.x,
                y: game.player1.y
            }
        });

        console.log(`game#${game.id} has started - ${games.size} game(s) being played`);

    }

}, 1000/60);