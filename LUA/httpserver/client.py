#!/usr/bin/env python3
"""httpserver/client.py — Linux test client for server.lua.

Run:  python3 client.py <device-ip> [port]

Sends a sequence of requests to the device HTTP server and prints results.
Default port: 8080

Tests:
  1. GET /              → "Hello from Lilka!"
  2. GET /count         → {"count":1}  (increments on each call)
  3. POST /echo         → echoes the JSON body
  4. GET /headers       → lists headers as seen by the device
  5. GET /unknown       → 404
  6. GET /stop          → tells the device server to shut down
"""

import sys
import json
import urllib.request
import urllib.error


def req(method: str, url: str, body: bytes | None = None, content_type: str | None = None):
    headers = {}
    if content_type:
        headers["Content-Type"] = content_type
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=10) as resp:
            data = resp.read()
            print(f"  {method} {url.split('/', 3)[-1] or '/'}")
            print(f"  → {resp.status} {data.decode(errors='replace')[:120]}")
            return resp.status, data
    except urllib.error.HTTPError as e:
        body_err = e.read()
        print(f"  {method} {url.split('/', 3)[-1] or '/'}")
        print(f"  → {e.code} {body_err.decode(errors='replace')[:120]}")
        return e.code, body_err
    except Exception as e:
        print(f"  ERROR: {e}")
        return None, None


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 client.py <device-ip> [port]")
        sys.exit(1)

    host = sys.argv[1]
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8080
    base = f"http://{host}:{port}"

    print(f"Testing device HTTP server at {base}\n")

    print("1. GET /")
    req("GET", f"{base}/")

    print("\n2. GET /count  (x3 — counter should increment)")
    for _ in range(3):
        status, data = req("GET", f"{base}/count")
        if data:
            try:
                obj = json.loads(data)
                print(f"     count = {obj.get('count')}")
            except Exception:
                pass

    print("\n3. POST /echo")
    payload = b'{"hello":"world","from":"linux"}'
    req("POST", f"{base}/echo", body=payload, content_type="application/json")

    print("\n4. GET /headers")
    req("GET", f"{base}/headers")

    print("\n5. GET /unknown (expect 404)")
    req("GET", f"{base}/unknown")

    print("\n6. GET /stop")
    req("GET", f"{base}/stop")

    print("\nDone.")


if __name__ == "__main__":
    main()
