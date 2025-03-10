const express = require("express");
const net = require("net");

const app = express();
const PORT = 3000;
const PYTHON_SERVER_HOST = "127.0.0.1";
const PYTHON_SERVER_PORT = 12345;

app.use(express.json());

app.post("/send-coordinates", (req, res) => {
    const { x, y } = req.body;
    if (x === undefined || y === undefined) {
        return res.status(400).send("Invalid coordinates");
    }

    // Create a TCP connection to the Python server
    const client = new net.Socket();
    client.connect(PYTHON_SERVER_PORT, PYTHON_SERVER_HOST, () => {
        client.write(`${x},${y}`);
    });

    client.on("data", (data) => {
        console.log("Response from Python server:", data.toString());
        client.destroy();
    });

    client.on("close", () => {
        res.send("Coordinates sent to Python server");
    });

    client.on("error", (err) => {
        console.error("TCP error:", err);
        res.status(500).send("Failed to send coordinates");
    });
});


// Start the Node.js relay server
app.listen(PORT, () => {
    console.log(`Node.js relay server running at http://localhost:${PORT}`);
});
