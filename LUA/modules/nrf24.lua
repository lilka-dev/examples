--[[
    Сканер діапазону 2.4 ГГц (модуль 004 RF, nRF24L01+)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/nrf24/
    Керування: B - вихід
--]]

local radio = assert(nrf24.new())
local hits = {}

function lilka.update(delta)
    hits = radio:scan(2)
    if controller.get_state().b.just_pressed then
        util.exit()
    end
end

function lilka.draw()
    display.fill_screen(display.color565(0, 0, 0))
    for ch = 1, #hits do
        local h = hits[ch] * 40
        display.fill_rect(10 + ch * 2, 200 - h, 2, h, display.color565(0, 255, 0))
    end
end
