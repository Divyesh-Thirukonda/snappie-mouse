import socket
import pyautogui
import time

# Create a TCP server
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(("127.0.0.1", 12345))
server_socket.listen(5)

print("Python TCP server listening on 127.0.0.1:12345")

while True:
    client_socket, client_address = server_socket.accept()
    try:
        data = client_socket.recv(1024).decode("utf-8")
        print(f"Received data: {data}")
        # if last time is less than 1 second ago
        if time.time() - last_time < 1:
            print("Too fast")
            client_socket.send("Too fast".encode("utf-8"))
            continue
        last_time = time.time()
        if data:
            x, y = map(float, data.split(","))
            x, y = int(x), int(y)
            print(f"Moving mouse to ({700+x}, {230+y})")
            pyautogui.moveTo(x, 350+y)
            client_socket.send("Mouse moved!".encode("utf-8"))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()





