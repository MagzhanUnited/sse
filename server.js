// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Respond with plain text "hi" at /
app.get("/", (req, res) => {
  res.send("hi");
});
// Create a simple list to keep track of connected clients
const clients = [];

// Respond with JSON object at /json
app.get("/json", (req, res) => {
  res.json({ text: "hi", numbers: [1, 2, 3] });
});

// Echo back query parameter in various formats at /echo
app.get("/echo", (req, res) => {
  const { input } = req.query;
  if (!input) {
    res.status(400).send("Missing input parameter");
    return;
  }

  const normal = input;
  const shouty = input.toUpperCase();
  const charCount = input.length;
  const backwards = input.split("").reverse().join("");

  res.json({ normal, shouty, charCount, backwards });
});

// Serve static files from "mychat" directory at /static/*
app.use("/static", express.static(path.join(__dirname, "mychat")));

app.get("/chat", (req, res) => {
  const { message } = req.query;

  if (!message) {
    res.status(400).send("Missing message parameter");
    return;
  }

  // Send the message to all connected clients
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify({ message })}\n\n`);
  });

  res.send("Message sent to chat");
});

// Establish SSE connection at /sse
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add the client to the list of connected clients
  clients.push(res);

  req.on("close", () => {
    // Remove the client when the connection is closed
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
