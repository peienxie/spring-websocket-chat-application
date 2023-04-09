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
    $("#message").on("keypress", (event) => {
        if (event.keyCode === 13 && !event.shiftKey) { // check if Enter key is pressed and Shift key is not pressed
            event.preventDefault(); // prevent the default behavior of the Enter key
            $("#send").click();
        }
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
        $("#connect").prop("disabled", (_) => true);
        $("#disconnect").prop("disabled", (_) => false);
        $("#message").prop("disabled", (_) => false);
        $("#send").prop("disabled", (_) => false);
        subscription = stompClient.subscribe("/topic/messages", (message) => {
            console.log("Received message" + message);
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
        $("#connect").prop("disabled", (_) => false);
        $("#disconnect").prop("disabled", (_) => true);
        $("#message").prop("disabled", (_) => true);
        $("#send").prop("disabled", (_) => true);
        alert("Disconnected!");
    });
}

function updateMessage(msg) {
    console.log("msg.username: " + msg.sender + "my username: " + username);

    const div = $("<div>");
    if (msg.sender === username) {
        div.addClass("message sent");
        $("<div>").addClass("content").text(msg.content).appendTo(div);
        $("<span>").addClass("time").text(convertRFC3339ToTime(msg.sendAt)).appendTo(div);
    } else {
        div.addClass("message received");
        $("<span>").addClass("username").text(msg.sender).appendTo(div);
        $("<span>").addClass("time").text(convertRFC3339ToTime(msg.sendAt)).appendTo(div);
        $("<div>").addClass("content").text(msg.content).appendTo(div);
    }
    const chatBody = $("#message-history");
    chatBody.append(div);
    // scroll smoothly to bottom
    chatBody.animate({
        scrollTop: chatBody.prop("scrollHeight")
    }, 500)
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