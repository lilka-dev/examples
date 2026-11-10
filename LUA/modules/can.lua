--[[
    CAN-сніфер (модуль 008 CAN)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/can/
    Керування: B - вихід
--]]

local bus = assert(can.new({bitrate = 500000, mode = "listen"}))

function lilka.update(delta)
    local msg = bus:receive()
    while msg do
        local hex = msg.data:gsub(".", function(c) return string.format("%02X ", c:byte()) end)
        console.print(string.format("%03X [%d] %s", msg.id, msg.dlc, hex))
        msg = bus:receive()
    end
    if controller.get_state().b.just_pressed then
        util.exit()
    end
end
