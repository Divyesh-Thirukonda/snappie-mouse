const SERVER_HOST = "127.0.0.1"; // Python server IP
const SERVER_PORT = 12345;       // Python server Port

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "send_coordinates") {
        let x = message.x;
        let y = message.y;

        // Send coordinates to local TCP proxy (Node.js)
        fetch("http://localhost:3000/send-coordinates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ x, y })
        })
        .then(response => response.text())
        .then(data => console.log("Server response:", data))
        .catch(error => console.error("Error sending coordinates:", error));
    }
});
