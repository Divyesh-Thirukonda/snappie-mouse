let arrowOverlay = null;
let lastMouseX = null;
let lastMouseY = null;
let lastDirection = null;
let isCtrlHeld = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "Control" && !isCtrlHeld) {
        isCtrlHeld = true;
        showArrowOverlay();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "Control") {
        isCtrlHeld = false;
        hideArrowOverlay();
        if (lastDirection) {
            moveToClosestElement(lastDirection);
        }
    }
});

document.addEventListener("mousemove", (event) => {
    if (!isCtrlHeld) return;

    const { clientX, clientY } = event;
    if (lastMouseX !== null && lastMouseY !== null) {
        const deltaX = clientX - lastMouseX;
        const deltaY = clientY - lastMouseY;

        if (deltaX !== 0 || deltaY !== 0) {
            lastDirection = getDirection(deltaX, deltaY);
            updateArrowDirection();
        }
    }

    lastMouseX = clientX;
    lastMouseY = clientY;
    updateArrowPosition(clientX, clientY);
});

function showArrowOverlay() {
    if (!arrowOverlay) {
        arrowOverlay = document.createElement("div");
        arrowOverlay.style.position = "fixed";
        arrowOverlay.style.width = "20px";
        arrowOverlay.style.height = "20px";
        arrowOverlay.style.pointerEvents = "none";
        arrowOverlay.style.zIndex = "9999";
        document.body.appendChild(arrowOverlay);
    }
    document.body.style.cursor = "none"; // Hide default cursor
}

function updateArrowPosition(x, y) {
    if (arrowOverlay) {
        arrowOverlay.style.left = `${x}px`;
        arrowOverlay.style.top = `${y}px`;
    }
}

function updateArrowDirection() {
    if (arrowOverlay && lastDirection) {
        let rotation = 0;
        switch (lastDirection) {
            case "up":
                rotation = 0;
                break;
            case "right":
                rotation = 90;
                break;
            case "down":
                rotation = 180;
                break;
            case "left":
                rotation = 270;
                break;
        }
        arrowOverlay.innerHTML = `<div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid red; transform: rotate(${rotation}deg);"></div>`;
    }
}

function hideArrowOverlay() {
    if (arrowOverlay) {
        arrowOverlay.remove();
        arrowOverlay = null;
    }
    document.body.style.cursor = "auto"; // Restore cursor
}

function moveToClosestElement(direction) {
    const { clientX: startX, clientY: startY } = { clientX: lastMouseX, clientY: lastMouseY };
    const elements = Array.from(document.querySelectorAll("a, button, [onclick], input, textarea, select"));

    let closestElement = null;
    let closestDistance = Infinity;

    elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementX = rect.left + rect.width / 2;
        const elementY = rect.top + rect.height / 2;

        let isValid = false;
        let distance = Math.hypot(elementX - startX, elementY - startY);

        switch (direction) {
            case "up":
                isValid = elementY < startY;
                break;
            case "down":
                isValid = elementY > startY;
                break;
            case "left":
                isValid = elementX < startX;
                break;
            case "right":
                isValid = elementX > startX;
                break;
        }

        if (isValid && distance < closestDistance) {
            closestElement = element;
            closestDistance = distance;
        }
    });

    if (closestElement) {
        // console.log("Moving to closest element:", closestElement);
        const rect = closestElement.getBoundingClientRect();
        sendCoordinates(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function getDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? "right" : "left";
    } else {
        return deltaY > 0 ? "down" : "up";
    }
}

function sendCoordinates(x, y) {
    chrome.runtime.sendMessage({ type: "send_coordinates", x: x, y: y });
}
