--[[
    Індикатор сигналу 433.92 МГц (модуль 004 RF, CC1101)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/cc1101/
    Керування: B - вихід
--]]

local radio = assert(cc1101.new({frequency = 433.92}))

function lilka.update(delta)
    if controller.get_state().b.just_pressed then
        util.exit()
    end
end

function lilka.draw()
    local rssi = radio:rssi()
    display.fill_screen(display.color565(0, 0, 0))
    display.set_cursor(10, 40)
    display.print(string.format("%.1f dBm", rssi))
    display.fill_rect(10, 80, math.max(0, (rssi + 110) * 3), 20, display.color565(255, 128, 0))
end
