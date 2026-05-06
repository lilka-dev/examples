#!/usr/bin/env python3
"""socket/client.py — Linux TCP client for server.lua.

Run:  python3 client.py <device-ip> [port]
Default port: 9000

Connects to the device TCP server, sends a series of test messages,
and verifies the echoed replies.
"""

import sys
import socket
import time


def send_line(sock: socket.socket, line: str) -> str:
    sock.sendall((line + "\n").encode())
    print(f"  SND: {line!r}")
    # Read until newline
    buf = b""
    while b"\n" not in buf:
        chunk = sock.recv(256)
        if not chunk:
            return ""
        buf += chunk
    reply = buf.split(b"\n", 1)[0].decode(errors="replace")
    print(f"  RCV: {reply!r}")
    return reply


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 client.py <device-ip> [port]")
        sys.exit(1)

    host = sys.argv[1]
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 9000

    print(f"Connecting to device TCP server at {host}:{port} …")
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(10.0)
    try:
        sock.connect((host, port))
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)
    print("Connected.\n")

    tests = [
        ("Hello from Linux!", "ECHO:Hello from Linux!"),
        ("PING",              "ECHO:PING"),
        ('{"key":"value"}',  'ECHO:{"key":"value"}'),
    ]

    passed = 0
    for msg, expected in tests:
        reply = send_line(sock, msg)
        if reply == expected:
            print(f"  PASS\n")
            passed += 1
        else:
            print(f"  FAIL — expected {expected!r}\n")

    # Send QUIT to close cleanly
    reply = send_line(sock, "QUIT")
    assert reply == "BYE", f"Expected BYE, got {reply!r}"
    print("  PASS (QUIT/BYE)\n")

    sock.close()
    print(f"Results: {passed}/{len(tests)} tests passed.")


if __name__ == "__main__":
    main()
