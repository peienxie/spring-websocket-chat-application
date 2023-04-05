let stompClient = null;
let subscription = null;
let username = null;

$(document).ready(() => {
    $("#connect").click(() => {
        connect();
    });
    $("#disconnect").click(() => {
        disconnect();
    });
    $("#send").click(() => {
        const content = $("#message").val()
        if (content !== "") {
            sendMessage(content);
            $("#message").val("");
        }
    });

});

function connect() {
    let socket = new SockJS("/chat");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        username = stompClient.ws._transport.url.split('/')[5];
        $("#send").prop("disabled", (_) => false);
        $("#connect").prop("disabled", (_) => true);
        $("#disconnect").prop("disabled", (_) => false);
        subscription = stompClient.subscribe("/topic/messages", (message) => {
            console.log("/topic/messages: " + message);
            updateMessage(JSON.parse(message.body));
        });
        console.log("subscription: " + JSON.stringify(subscription));
    });
}

function disconnect() {
    if (subscription !== null) {
        subscription.unsubscribe();
    }
    stompClient.disconnect(() => {
        $("#send").prop("disabled", (_) => true);
        $("#connect").prop("disabled", (_) => false);
        $("#disconnect").prop("disabled", (_) => true);
        alert("Disconnected!");
    });
}

function updateMessage(msg) {
    const div = $("<div>");
    console.log("msg.username: " + msg.username + "my username: " + username);
    if (msg.username === username) {
        div.addClass("message-container darker");
    } else {
        div.addClass("message-container");
    }
    $("<p>").text(msg.username + ": " + msg.content).appendTo(div);
    $("<span>").text(convertRFC3339ToTime(msg.timestamp)).appendTo(div);
    $("#message-history").append(div);
}

function convertRFC3339ToTime(datetimeStr) {
    const date = new Date(datetimeStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

function sendMessage(content) {
    stompClient.send("/app/chat/message", {}, JSON.stringify({ "content": content }));
}