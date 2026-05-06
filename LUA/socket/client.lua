-- socket/client.lua
-- Raw TCP client using the net module.
-- Connects to a Linux TCP echo server (server.py) and sends/receives lines.
--
-- Change HOST to the IP of the machine running server.py.

local HOST    = "192.168.68.218"
local PORT    = 9000
local TIMEOUT = 5000  -- ms

-- Connect
local fd, err = net.connect(HOST, PORT, TIMEOUT)
if not fd then
    print("connect() failed:", err)
    return
end
print("Connected to", HOST, PORT)

-- Send a few messages and read back echoes
local messages = {
    "Hello from Lilka!\n",
    "PING\n",
    '{"key":"value"}\n',
    "QUIT\n",
}

for _, msg in ipairs(messages) do
    -- Send
    local sent, send_err = net.send(fd, msg)
    if not sent then
        print("send() failed:", send_err)
        break
    end
    print("SND:", msg:gsub("\n", ""))

    -- Receive echo (or server reply)
    local reply, recv_err = net.receive(fd, 256, TIMEOUT)
    if reply then
        print("RCV:", reply:gsub("\n", ""))
    else
        print("recv:", recv_err)
        if recv_err == "connection closed" then
            break
        end
    end
end

net.close(fd)
print("Done.")
