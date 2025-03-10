# check where the mouse is
import pyautogui

# Get the current mouse position
while True:
    x, y = pyautogui.position()
    print(f"Mouse position: ({x}, {y})")