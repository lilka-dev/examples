-- socket/server.lua
-- Raw TCP server using the net module.
-- Accepts connections from a Linux client (client.py) and echoes data back.
--
-- The device must be connected to Wi-Fi before this script runs.
-- After launch, note the device IP and set it in client.py.

local PORT    = 9000
local BACKLOG = 3
local TIMEOUT = 10000  -- ms to wait for the next connection

-- Open server socket
local server_fd, err = net.listen(PORT, BACKLOG)
if not server_fd then
    print("listen() failed:", err)
    return
end
print("TCP server listening on port", PORT)

local running = true
while running do
    -- Accept next client
    local client_fd, client_ip = net.accept(server_fd, TIMEOUT)
    if not client_fd then
        -- client_ip holds the error message on failure
        if client_ip ~= "timeout" then
            print("accept() failed:", client_ip)
        end
        -- loop — keep waiting (or check a stop condition here)
    else
        print("Client connected from", client_ip)

        -- Echo loop for this client
        net.settimeout(client_fd, 5000)
        while true do
            local data, recv_err = net.receive(client_fd, 256)
            if not data then
                if recv_err ~= "timeout" then
                    print("Client disconnected:", recv_err)
                end
                break
            end

            local trimmed = data:gsub("%s+$", "")
            print("RCV:", trimmed)

            -- Special command: "QUIT" closes only this client
            if trimmed == "QUIT" then
                net.send(client_fd, "BYE\n")
                break
            end

            -- Special command: "STOP" shuts down the whole server
            if trimmed == "STOP" then
                net.send(client_fd, "SERVER STOPPING\n")
                running = false
                break
            end

            -- Echo back with a prefix
            local reply = "ECHO:" .. trimmed .. "\n"
            local _, send_err = net.send(client_fd, reply)
            if send_err then
                print("send() failed:", send_err)
                break
            end
        end

        net.close(client_fd)
        print("Client closed")
    end
end

net.close(server_fd)
print("Server stopped.")
