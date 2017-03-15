var stompClient = null;

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        
        stompClient.subscribe('/topic/newpoint', function (data) {
            alert(data.body);
            var theObject=JSON.parse(data.body);
            
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
    
};

function sendPoint(){
    var p = new Punto(x,y);
    console.log(JSON.stringify(p.coordenadas));
    stompClient.send("/topic/newpoint", {}, JSON.stringify(p.coordenadas));
}


$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');

        }
);
