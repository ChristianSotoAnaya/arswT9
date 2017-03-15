var stompClient = null;

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/newpoint', function (data) {
            var theObject = JSON.parse(data.body);
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.beginPath();
            ctx.arc(theObject.x, theObject.y, 1, 0, 2 * Math.PI);
            ctx.stroke();

        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}


function myFunction() {
    x = prompt("Ingrese la coordenada x");
    y = prompt("Ingrese la coordenada y");

}
;

function sendPoint() {
    var p = new Punto(x, y);
    console.log(JSON.stringify(p.coordenadas));
    stompClient.send("/topic/newpoint", {}, JSON.stringify(p.coordenadas));
}


$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');
            function getMousePos(canvas, evt) {
                var rect = canvas.getBoundingClientRect();
                return {
                    x: evt.clientX - rect.left,
                    y: evt.clientY - rect.top
                };
            }
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');

            canvas.addEventListener('mousedown', function (evt) {
                var mousePos = getMousePos(canvas, evt);
                var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                x=mousePos.x;
                y=mousePos.y;
                sendPoint();
            }, false);

        }
);
