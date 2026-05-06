# temp/ — Network examples for Lilka / Keira

Each subdirectory contains a paired Lua script (runs on device) and a
Python script (runs on a Linux machine on the same network).

## Directory layout

```
temp/
  http/
    client.lua      Device: HTTP GET/POST using http.execute()
    server.py       Linux: HTTP test server
  httpserver/
    server.lua      Device: HTTP server using httpserver.*
    client.py       Linux: sends requests to the device
  mqtt/
    pubsub.lua      Device: MQTT publish + subscribe using mqtt.*
    broker.py       Linux: MQTT test client (needs paho-mqtt + Mosquitto)
  socket/
    client.lua      Device: raw TCP client using net.*
    server.lua      Device: raw TCP echo server using net.*
    server.py       Linux: TCP echo server (pair with client.lua)
    client.py       Linux: TCP test client (pair with server.lua)
```

---

## http

### Device side — `client.lua`
Makes three requests against the Linux server:
- `GET /hello` → receives a greeting
- `POST /echo` → sends JSON, receives it back
- `GET /file`  → downloads to `/sd/downloaded.txt`

### Linux side — `server.py`
```bash
python3 server.py [port]   # default 8080
```
No extra dependencies — uses the Python standard library only.

Edit `HOST` in `client.lua` to match your Linux machine's IP.

---

## httpserver

### Device side — `server.lua`
Routes:
| Method | Path       | Description                        |
|--------|------------|------------------------------------|
| GET    | /          | Static greeting                    |
| GET    | /count     | JSON counter (increments per hit)  |
| POST   | /echo      | Returns request body               |
| GET    | /headers   | Lists received request headers     |
| GET    | /stop      | Gracefully stops the server loop   |

### Linux side — `client.py`
```bash
python3 client.py <device-ip> [port]   # default 8080
```
No extra dependencies.

---

## mqtt

### Device side — `pubsub.lua`
- Connects to the broker at `BROKER_HOST`.
- Subscribes to `lilka/in` for incoming commands.
- Publishes 20 fake sensor readings to `lilka/out`.
- Reacts to a `"reset"` command by resetting the counter.

### Linux side — `broker.py`
Requires **paho-mqtt** and a running **Mosquitto** broker:
```bash
# Install once
pip install paho-mqtt
sudo apt install mosquitto   # or brew install mosquitto

# Start broker (separate terminal)
mosquitto -v

# Run test client
python3 broker.py [broker-ip] [port]   # default 127.0.0.1:1883
```
After 5 messages it sends a `"reset"` command; after 10 messages it exits.

Edit `BROKER_HOST` in `pubsub.lua` to match your Linux machine's IP.

---

## socket

### `client.lua` ↔ `server.py` (device connects to Linux)
```bash
python3 server.py [port]   # default 9000
```
Set `HOST` in `client.lua` to the Linux machine IP, then run `client.lua` on
the device. The device sends messages; the server echoes them back.

### `server.lua` ↔ `client.py` (Linux connects to device)
```bash
python3 client.py <device-ip> [port]   # default 9000
```
Run `server.lua` on the device first, then run `client.py` on Linux.
`client.py` verifies the echoed replies and prints PASS/FAIL per test.

Special commands understood by both `server.lua` and `server.py`:
- `QUIT` — closes the current connection
- `STOP` — shuts down the whole server loop
