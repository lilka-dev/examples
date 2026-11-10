--[[
    LoRa-чат між двома Лілками (модуль 003 LORA)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/lora/
    Керування: A - надіслати, B - вихід
--]]

local radio = assert(lora.new({chip = "sx1262", frequency = 868100000, sf = 7}))
local last = "-"

function lilka.update(delta)
    local packet = radio:receive()
    if packet then
        last = string.format("%s (%.0f dBm, SNR %.1f)", packet.data, packet.rssi, packet.snr)
    end
    local state = controller.get_state()
    if state.a.just_pressed then
        radio:send("Привіт від Лілки!")
    end
    if state.b.just_pressed then
        util.exit()
    end
end

function lilka.draw()
    display.fill_screen(display.color565(0, 0, 0))
    display.set_cursor(10, 40)
    display.print("A - надіслати\n" .. last)
end
