--[[
    Навчити й повторити ІЧ-пульт (модуль 002 IR)
    Документація: https://docs.lilka.dev/projects/keira/uk/latest/lua/reference/ir/
    Керування: A - повторити вивчений сигнал, B - вихід
--]]

local remote = assert(ir.new())
local learned = nil

function lilka.update(delta)
    local code = remote:receive()
    if code and not code["repeat"] then
        learned = code
    end
    local state = controller.get_state()
    if state.a.just_pressed and learned then
        remote:send_raw(learned.raw)
    end
    if state.b.just_pressed then
        util.exit()
    end
end

function lilka.draw()
    display.fill_screen(display.color565(0, 0, 0))
    display.set_cursor(10, 40)
    if learned then
        display.print(string.format("%s 0x%X 0x%X\nA - повторити", learned.protocol,
            learned.address or 0, learned.command or 0))
    else
        display.print("Натисніть кнопку на пульті")
    end
end
