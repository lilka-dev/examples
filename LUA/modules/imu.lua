--[[
    Акселерометр і гіроскоп (модуль 006 GYRO MAGNET, BMI260)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/imu/
    Керування: B - вихід
--]]

local sensor = assert(imu.new())

function lilka.update(delta)
    if controller.get_state().b.just_pressed then
        util.exit()
    end
end

function lilka.draw()
    local d = sensor:read()
    display.fill_screen(display.color565(0, 0, 0))
    display.set_cursor(10, 40)
    if d then
        display.print(string.format("a: %.2f %.2f %.2f g\ng: %.1f %.1f %.1f", d.ax, d.ay, d.az, d.gx, d.gy, d.gz))
    end
end
