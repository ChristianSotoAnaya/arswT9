var stompClient = null;

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
            var sala = document.getElementById("numerosala").value;

        stompClient.subscribe('/topic/newdibujo.' + sala, function (data) {
            var theObject = JSON.parse(data.body);
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.beginPath();
            ctx.arc(theObject.x, theObject.y, 1, 0, 2 * Math.PI);
            ctx.stroke();

        });
        stompClient.subscribe('/topic/newpolygon.' + sala, function (data) {
            var theObject = JSON.parse(data.body);
            var c = document.getElementById("myCanvas");
            var c2 = c.getContext("2d");
            c2.fillStyle = '#ffff';
            c2.beginPath();
            c2.moveTo(theObject[0].x, theObject[0].y);
            for (i = 1; i < theObject.length; i++) {
                c2.lineTo(theObject[i].x, theObject[i].y);
            }
            c2.closePath();
            c2.fill();

        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    //setConnected(false);
    console.log("Disconnected");
}


function myFunction() {
    x = prompt("Ingrese la coordenada x");
    y = prompt("Ingrese la coordenada y");

}


function suscribe() {
    disconnect();
    connect();

    var sala = document.getElementById("numerosala").value;
    var nombre = document.getElementById("nombre").value;
    $.ajax({
        url: "/dibujos/" + sala,
        type: 'PUT',
        data:  JSON.stringify(nombre),
        contentType: "application/json"
    });

}

function sendPoint() {
    var p = new Punto(x, y);
    var sala = document.getElementById("numerosala").value;
    //console.log(JSON.stringify(p.coordenadas));
    
    stompClient.send("/app/newdibujo." + sala, {}, JSON.stringify(p.coordenadas));
}




$(document).ready(
        function () {
            //connect();
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
                x = mousePos.x;
                y = mousePos.y;
                sendPoint();
            }, false);

        }
);
