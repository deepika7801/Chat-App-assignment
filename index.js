/**
 *Create a socket connection to emit the event
 *Add event listener to button which will emit the event
 *Listen to the emitted event using socket.on
 *Display the message to all clients using QueryDOM
 *
 */
var socket = io.connect("http://localhost:8000");
var message = document.getElementById("message");
var messageSection = document.getElementById("message-section");
var username = document.getElementById("name");
var sendBtn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var joinBtn = document.getElementById("join");
var date = document.getElementById("current-date");

//Click join button to move to Chat Window
joinBtn.addEventListener("click", function () {
  if (username.value.length != 0) {
    document.getElementById("join-page").style.display = "none";
    document.getElementById("chat-page").style.display = "flex";
    document.body.style.backgroundImage = "url('../assets/chatBackground.jpg')";
    document.getElementById("chat-page-heading").innerHTML = username.value;
    socket.emit("joined", username.value);
    date.innerHTML =
      "<p style='text-align:center;font-size:20px' >" +
      new Date().toLocaleDateString() +
      "</p>";
  } else {
    alert("Enter the user name to join chat");
  }
});

//To display message in chat box when event listener is invoked
sendBtn.addEventListener("click", function () {
  if (message.value != "") {
    feedback.innerHTML = "";
    output.innerHTML +=
      "<p class='your-message'><strong> you</strong><span style='float:right'>" +
      "<small>" +
      getCurrentTime() +
      "</small>" +
      "</span><br>" +
      message.value;
    ("</p>");

    //To emit the chat event
    socket.emit("chat", { message: message.value, username: username.value });
    messageSection.scrollTop = messageSection.scrollHeight;
  } else {
    alert("Enter a message");
  }
  message.value = "";
});

//To emit an event while typing a message
message.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    send.click();
  } else {
    socket.emit("typing", username.value);
  }
});

//Listen for events and display join message in chat box
socket.on("joined", function (data) {
  feedback.innerHTML = "";
  output.innerHTML +=
    "<p style='text-align:center'><em>" + data + "  joined the chat</em></p>";
});

//Listen for emitted event and display the message to others using broadcast
socket.on("chat", function (data) {
  feedback.innerHTML = "";
  output.innerHTML +=
    "<p class='others-message'> <strong>" +
    data.username +
    "</strong>" +
    "<span style='float:right'><small>" +
    getCurrentTime() +
    "</small>" +
    "</span><br>" +
    data.message +
    "</p>";
  messageSection.scrollTop = messageSection.scrollHeight;
});

//To display the username who left the chat
socket.on("left", function (data) {
  if (data.length != 0) {
    output.innerHTML +=
      "<p style='text-align:center'><em>" + data + "  left the chat</em></p>";
  }
});

//To display the username who is typing a message using broadcast
socket.on("typing", function (data) {
  feedback.innerHTML =
    "<p style='text-align:center'>" + data + "  is typing a message....</p>";
});

/**
 *To get the current time using date
 *Convert the time into standard format and return the time
 *
 * @return {string} To display the send message with current time
 */
function getCurrentTime() {
  let currentDate = new Date();
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();
  let period = "am";
  if (hour == 12) {
    period = "pm";
  }
  if (hour > 12) {
    hour -= 12;
  }
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  var current_time = `${hour}:${minute} ${period}`;
  return current_time;
}
