--[[
    Компас з калібруванням (модуль 006 GYRO MAGNET, TMAG5273)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/mag/
    Керування: A - почати/завершити калібрування, B - вихід
--]]

local sensor = assert(mag.new())
local calibrating = false

function lilka.update(delta)
    local state = controller.get_state()
    if state.a.just_pressed then
        calibrating = not calibrating
        if calibrating then sensor:start_calibration() else sensor:stop_calibration() end
    end
    if state.b.just_pressed then
        util.exit()
    end
end

function lilka.draw()
    local heading = sensor:heading()
    display.fill_screen(display.color565(0, 0, 0))
    display.set_cursor(10, 40)
    display.print(calibrating and "Обертайте Лілку...\nA - готово" or
        string.format("%.0f°\nA - калібрування", heading or 0))
end
