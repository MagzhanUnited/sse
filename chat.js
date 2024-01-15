document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const messageForm = document.getElementById("messageForm");
  const messageInput = document.getElementById("messageInput");

  // Establish SSE connection to /sse
  const eventSource = new EventSource("http://localhost:3000/sse");

  // Handle incoming messages
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    appendMessage(data.message);
  };

  // Handle errors
  eventSource.onerror = (error) => {
    console.error("Error with SSE connection:", error);
  };

  // Append message to the messages div
  function appendMessage(message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
  }

  // Submit message to the server when the form is submitted
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newMessage = messageInput.value.trim();

    if (newMessage !== "") {
      sendMessageToServer(newMessage);
      messageInput.value = ""; // Clear the input field
    }
  });

  // Function to send message to the server
  function sendMessageToServer(message) {
    fetch("http://localhost:3000/chat?message=" + encodeURIComponent(message), {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Failed to send message to server:",
            response.status,
            response.statusText
          );
        }
      })
      .catch((error) => {
        console.error("Error sending message to server:", error);
      });
  }
});
