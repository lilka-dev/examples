-- http/client.lua
-- Demonstrates http.execute() — GET and POST over both HTTP and HTTPS.
-- Pair with server.py running on a Linux machine on the same network.
--
-- server.py serves:
--   HTTP  on port 8080
--   HTTPS on port 8443  (self-signed cert, device uses setInsecure())
--
-- Usage: change HOST to the IP of the Linux machine running server.py.

local HOST       = "192.168.68.218"
local HTTP_PORT  = 8080
local HTTPS_PORT = 8443

local function run_test(label, opts)
    local result = http.execute(opts)
    if result.code == http.HTTP_CODE_OK then
        if result.response then
            print(label .. " OK: " .. result.response)
        else
            print(label .. " OK (file saved)")
        end
    else
        print(label .. " FAILED, code: " .. tostring(result.code))
    end
end

-- ── HTTP tests ───────────────────────────────────────────────────────────────
print("--- HTTP ---")

run_test("HTTP GET /hello", {
    url    = "http://" .. HOST .. ":" .. HTTP_PORT .. "/hello",
    method = "GET",
})

run_test("HTTP POST /echo", {
    url    = "http://" .. HOST .. ":" .. HTTP_PORT .. "/echo",
    method = "POST",
    body   = '{"msg":"hello over http"}',
})

run_test("HTTP GET /file", {
    url  = "http://" .. HOST .. ":" .. HTTP_PORT .. "/file",
    file = "/sd/http_downloaded.txt",
})

-- ── HTTPS tests ──────────────────────────────────────────────────────────────
print("--- HTTPS ---")

run_test("HTTPS GET /hello", {
    url    = "https://" .. HOST .. ":" .. HTTPS_PORT .. "/hello",
    method = "GET",
})

run_test("HTTPS POST /echo", {
    url    = "https://" .. HOST .. ":" .. HTTPS_PORT .. "/echo",
    method = "POST",
    body   = '{"msg":"hello over https"}',
})

run_test("HTTPS GET /file", {
    url  = "https://" .. HOST .. ":" .. HTTPS_PORT .. "/file",
    file = "/sd/https_downloaded.txt",
})
