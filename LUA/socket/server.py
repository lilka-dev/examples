#!/usr/bin/env python3
"""socket/server.py — Linux TCP echo server for client.lua.

Run:  python3 server.py [port]
Default port: 9000

Handles one client at a time.  Echoes every line back with an "ECHO:" prefix.
Supports special commands:
  QUIT → closes the connection cleanly
  STOP → shuts down the server
"""

import sys
import socket


def handle(conn: socket.socket, addr):
    print(f"[+] Connection from {addr[0]}:{addr[1]}")
    conn.settimeout(10.0)
    try:
        buf = b""
        while True:
            try:
                chunk = conn.recv(256)
            except socket.timeout:
                print("  Client timed out.")
                break
            if not chunk:
                print("  Client disconnected.")
                break
            buf += chunk
            while b"\n" in buf:
                line, buf = buf.split(b"\n", 1)
                text = line.decode(errors="replace").rstrip()
                print(f"  RCV: {text!r}")
                if text == "QUIT":
                    conn.sendall(b"BYE\n")
                    return False      # normal close
                if text == "STOP":
                    conn.sendall(b"SERVER STOPPING\n")
                    return True       # signal server shutdown
                conn.sendall(f"ECHO:{text}\n".encode())
    finally:
        conn.close()
    return False


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9000
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("0.0.0.0", port))
    srv.listen(3)
    print(f"TCP echo server listening on 0.0.0.0:{port}  (Ctrl-C to stop)")
    try:
        while True:
            conn, addr = srv.accept()
            stop = handle(conn, addr)
            if stop:
                print("Shutdown requested by client.")
                break
    except KeyboardInterrupt:
        print("\nInterrupted.")
    finally:
        srv.close()
    print("Server stopped.")


if __name__ == "__main__":
    main()
