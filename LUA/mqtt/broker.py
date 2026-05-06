#!/usr/bin/env python3
"""mqtt/broker.py — Self-contained MQTT broker + test client for pubsub.lua.

Starts a real MQTT broker on port 1883, then acts as a test client.

Requirements (choose one):
  pip install amqtt paho-mqtt    ← pure-Python broker (preferred)
  OR: have mosquitto installed   ← fallback (sudo apt install mosquitto)

Behaviour:
  - Subscribes to lilka/out (device publishes here)
  - Prints every received message
  - After receiving 5 messages, sends a "reset" command to lilka/in
  - After receiving 10 messages total, exits
"""

import asyncio
import shutil
import subprocess
import sys
import threading
import time

PUB_TOPIC = "lilka/out"
CMD_TOPIC = "lilka/in"
TIMEOUT_S = 120
PORT      = 1883

# ── broker backends ───────────────────────────────────────────────────────────

def start_amqtt_broker(ready_event: threading.Event):
    """Run amqtt broker in its own asyncio event loop (background thread)."""
    from amqtt.broker import Broker

    config = {
        "listeners": {
            "default": {"type": "tcp", "bind": f"0.0.0.0:{PORT}"},
        },
        "sys_interval": 0,
        "auth":         {"allow-anonymous": True},
        "topic-check":  {"enabled": False},
    }

    async def _run():
        broker = Broker(config)
        await broker.start()
        ready_event.set()
        # Run until the process exits
        await asyncio.get_event_loop().create_future()

    loop = asyncio.new_event_loop()
    loop.run_until_complete(_run())


def start_mosquitto_broker(ready_event: threading.Event):
    """Spawn mosquitto as a subprocess."""
    proc = subprocess.Popen(
        ["mosquitto", "-p", str(PORT)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1.0)   # give it a moment to bind
    ready_event.set()
    proc.wait()


def launch_broker() -> bool:
    """Try amqtt, fall back to mosquitto. Returns True if broker started."""
    ready = threading.Event()

    # Try amqtt first
    try:
        import amqtt  # noqa: F401
        t = threading.Thread(target=start_amqtt_broker, args=(ready,), daemon=True)
        t.start()
        if ready.wait(timeout=5):
            print(f"[broker] amqtt broker listening on 0.0.0.0:{PORT}")
            return True
        print("[broker] amqtt failed to start in time")
    except ImportError:
        pass

    # Fall back to system mosquitto
    if shutil.which("mosquitto"):
        t = threading.Thread(target=start_mosquitto_broker, args=(ready,), daemon=True)
        t.start()
        if ready.wait(timeout=5):
            print(f"[broker] mosquitto broker listening on 0.0.0.0:{PORT}")
            return True
        print("[broker] mosquitto failed to start in time")
    else:
        print("[broker] mosquitto not found")

    return False


# ── paho test client ──────────────────────────────────────────────────────────

def run_client():
    import paho.mqtt.client as mqtt

    received = []
    done = threading.Event()

    def on_connect(client, userdata, flags, rc, properties=None):
        if rc == 0:
            print(f"[client] Connected to 127.0.0.1:{PORT}")
            client.subscribe(PUB_TOPIC, qos=1)
            print(f"[client] Subscribed to {PUB_TOPIC}")
        else:
            print(f"[client] Connection refused rc={rc}")
            done.set()

    def on_message(client, userdata, msg):
        payload = msg.payload.decode(errors="replace")
        print(f"[client] RCV {msg.topic}: {payload}")
        received.append(payload)

        if len(received) == 5:
            print("[client] Sending 'reset' command …")
            client.publish(CMD_TOPIC, "reset", qos=1)

        if len(received) >= 10:
            print("[client] 10 messages received — done.")
            done.set()

    def on_disconnect(client, userdata, disconnect_flags, rc, properties=None):
        print(f"[client] Disconnected (rc={rc})")

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="linux-tester")
    client.on_connect    = on_connect
    client.on_message    = on_message
    client.on_disconnect = on_disconnect

    client.connect("127.0.0.1", PORT, keepalive=30)
    client.loop_start()

    if not done.wait(timeout=TIMEOUT_S):
        print(f"[client] Timeout after {TIMEOUT_S}s ({len(received)} messages received).")

    client.loop_stop()
    client.disconnect()
    print(f"[client] Total messages received: {len(received)}")


# ── main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if not launch_broker():
        print(
            "ERROR: no broker backend available.\n"
            "Install one of:\n"
            "  pip install amqtt paho-mqtt\n"
            "  sudo apt install mosquitto"
        )
        sys.exit(1)

    try:
        run_client()
    except ImportError:
        print("ERROR: paho-mqtt not installed. Run: pip install paho-mqtt")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopped.")

    client.loop_start()

    if not done_event.wait(timeout=TIMEOUT_S):
        print(f"[broker.py] Timeout after {TIMEOUT_S}s "
              f"(received {len(received)} messages).")

    client.loop_stop()
    client.disconnect()
    print(f"[broker.py] Done. Total messages received: {len(received)}")


if __name__ == "__main__":
    main()
