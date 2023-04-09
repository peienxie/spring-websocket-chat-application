let stompClient = null;
let subscriptions = [];
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
        subscriptions.push(subscription)

        subscription = stompClient.subscribe("/topic/user", (message) => {
            console.log("Received user event message:" + message);
            updateUserEvent(JSON.parse(message.body));
        });
        subscriptions.push(subscription)

        // Subscribe to the error channel
        errorSubscription = stompClient.subscribe('/user/queue/errors', (errorFrame) => {
            console.error(`Received error: ${errorFrame}`);
        });
        subscriptions.push(errorSubscription)
        console.log("subscriptions: " + JSON.stringify(subscriptions));

        sendUserJoin()
    });
}

function disconnect() {
    sendUserLeave()

    subscriptions.forEach(sub => sub.unsubscribe())

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

    $("#message-history").append(div);
    scrollSmoothlyToBottom();
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

function updateUserEvent(event) {
    const div = $("<div>").addClass("user-event");
    $("<span>").addClass("username").text(event.username).appendTo(div);
    if (event.event === "USER_JOIN") {
        $("<span>").text("join.").appendTo(div);
    } else {
        $("<span>").text("leave.").appendTo(div);
    }

    $("#message-history").append(div);
    scrollSmoothlyToBottom();
}

function scrollSmoothlyToBottom() {
    const chatBody = $("#message-history");
    chatBody.animate({
        scrollTop: chatBody.prop("scrollHeight")
    }, 500)
}

function sendMessage(content) {
    stompClient.send("/app/chat/message", {}, JSON.stringify({ "content": content }));
}

function sendUserJoin() {
    stompClient.send("/app/user/join", { "username": username });
}

function sendUserLeave() {
    stompClient.send("/app/user/leave", { "username": username });
}
