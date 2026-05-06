-- httpserver/server.lua
-- Runs a minimal HTTP server on the device.
-- Pair with client.py running on a Linux machine on the same network.
--
-- The device must be connected to Wi-Fi before this script runs.
-- After launch, note the device IP and set it in client.py.

local PORT = 8080
local TIMEOUT_MS = 5000  -- how long to wait for each connection

-- Start listening
local server_fd, err = httpserver.listen(PORT)
if not server_fd then
    print("listen() failed:", err)
    return
end
print("HTTP server listening on port", PORT)

-- Request counter for a simple stateful /count endpoint
local counter = 0

-- Serve requests until the B-button is held (if available)
while true do
    local req, accept_err = httpserver.accept(server_fd, TIMEOUT_MS)

    if req == nil then
        -- timeout — check controller and loop
        if accept_err ~= "timeout" then
            print("accept error:", accept_err)
        end
    else
        print(req.method, req.path, "from", req.client_ip)

        -- Route dispatch
        if req.method == "GET" and req.path == "/" then
            httpserver.respond(req.fd, 200,
                { ["Content-Type"] = "text/plain" },
                "Hello from Lilka!")

        elseif req.method == "GET" and req.path == "/count" then
            counter = counter + 1
            httpserver.respond(req.fd, 200,
                { ["Content-Type"] = "application/json" },
                '{"count":' .. tostring(counter) .. '}')

        elseif req.method == "POST" and req.path == "/echo" then
            -- Echo the request body back
            httpserver.respond(req.fd, 200,
                { ["Content-Type"] = req.headers["content-type"] or "text/plain" },
                req.body)

        elseif req.method == "GET" and req.path == "/headers" then
            -- Return all received headers as plain text
            local lines = {}
            for k, v in pairs(req.headers) do
                lines[#lines + 1] = k .. ": " .. v
            end
            httpserver.respond(req.fd, 200,
                { ["Content-Type"] = "text/plain" },
                table.concat(lines, "\n"))

        elseif req.method == "GET" and req.path == "/stop" then
            httpserver.respond(req.fd, 200,
                { ["Content-Type"] = "text/plain" },
                "Stopping server.")
            break

        else
            httpserver.respond(req.fd, 404,
                { ["Content-Type"] = "text/plain" },
                "Not Found")
        end
    end
end

httpserver.close(server_fd)
print("Server stopped.")
