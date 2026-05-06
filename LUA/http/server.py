#!/usr/bin/env python3
"""http/server.py — Linux HTTP + HTTPS test server for client.lua.

Run:  python3 server.py

Starts two servers in parallel threads:
  HTTP  on port 8080  (plain)
  HTTPS on port 8443  (self-signed cert — auto-generated with openssl)

The device uses WiFiClientSecure.setInsecure(), so no CA trust is needed.

Endpoints (same on both ports):
  GET  /hello  → 200 "Hello from Linux!"
  POST /echo   → 200 echoes request body
  GET  /file   → 200 small text payload
"""

import os
import ssl
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

HTTP_PORT  = 8080
HTTPS_PORT = 8443
CERT_FILE  = os.path.join(os.path.dirname(__file__), "server.crt")
KEY_FILE   = os.path.join(os.path.dirname(__file__), "server.key")


def ensure_cert():
    if os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE):
        return
    print("Generating self-signed certificate …")
    subprocess.run(
        [
            "openssl", "req", "-x509", "-newkey", "rsa:2048",
            "-keyout", KEY_FILE,
            "-out",    CERT_FILE,
            "-days",   "3650",
            "-nodes",
            "-subj",   "/CN=lilka-test",
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"Certificate: {CERT_FILE}")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        scheme = "HTTPS" if isinstance(self.connection, ssl.SSLSocket) else "HTTP "
        print(f"[{scheme}][{self.address_string()}]", fmt % args)

    def do_GET(self):
        if self.path == "/hello":
            self._respond(200, b"Hello from Linux!")
        elif self.path == "/file":
            self._respond(200, b"line1\nline2\nline3\n", content_type="text/plain")
        else:
            self._respond(404, b"Not Found")

    def do_POST(self):
        if self.path == "/echo":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            print("  body:", body.decode(errors="replace"))
            self._respond(200, body, content_type=self.headers.get("Content-Type", "text/plain"))
        else:
            self._respond(404, b"Not Found")

    def _respond(self, status: int, body: bytes, content_type: str = "text/plain"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run_http():
    srv = HTTPServer(("0.0.0.0", HTTP_PORT), Handler)
    print(f"HTTP  listening on 0.0.0.0:{HTTP_PORT}")
    srv.serve_forever()


def run_https():
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)
    srv = HTTPServer(("0.0.0.0", HTTPS_PORT), Handler)
    srv.socket = ctx.wrap_socket(srv.socket, server_side=True)
    print(f"HTTPS listening on 0.0.0.0:{HTTPS_PORT}")
    srv.serve_forever()


if __name__ == "__main__":
    ensure_cert()
    t_http  = threading.Thread(target=run_http,  daemon=True)
    t_https = threading.Thread(target=run_https, daemon=True)
    t_http.start()
    t_https.start()
    print("Press Ctrl-C to stop.")
    try:
        t_http.join()
    except KeyboardInterrupt:
        print("\nStopped.")
