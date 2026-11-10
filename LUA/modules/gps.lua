--[[
    GPS: координати і супутники (модуль 005 GPS)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/gps/
    Керування: B - вихід
--]]

local receiver = assert(gps.new())

function lilka.update(delta)
    receiver:update()
    if controller.get_state().b.just_pressed then
        receiver:close()
        util.exit()
    end
end

function lilka.draw()
    local fix = receiver:fix()
    display.fill_screen(display.color565(0, 0, 0))
    display.set_cursor(10, 40)
    if fix.valid then
        display.print(string.format("%.5f %.5f\n%.0f m, %d sat", fix.latitude, fix.longitude,
            fix.altitude, fix.satellites))
    else
        display.print("Шукаю супутники: " .. #receiver:satellites())
    end
end
