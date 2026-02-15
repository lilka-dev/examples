BLACK = display.color565(0, 0, 0)
WHITE = display.color565(255, 255, 255)

local sounds = {
    "stardust_memories.mod",
    "gs-16b-1c-44100hz.aac",
    "gs-16b-1c-44100hz.flac",
    "gs-16b-1c-44100hz.mp3",
    "gs-16b-1c-44100hz.wav",

}
local sound_index = 0
local sound = nil

function lilka.update()
    keyboard = controller.get_state()

    if keyboard.a.just_pressed then
        if sound ~= nil then
            if audio.is_playing() then
                audio.pause()
            else
                audio.resume()
            end
        end
    end

    if keyboard.left.just_pressed or keyboard.right.just_pressed then
        if keyboard.right.just_pressed then
            sound_index = (sound_index % #sounds) + 1
        else
            sound_index = (sound_index - 2) % #sounds + 1
        end

        if sound ~= nil then
            audio.stop()
            resources.delete(sound)
        end
        sound = resources.load_audio(sounds[sound_index])
        audio.play(sound)
    end

    if keyboard.up.just_pressed then
        audio.set_volume(math.min({audio.get_volume() + 0.1, 4.0}))
    end

    if keyboard.down.just_pressed then
        audio.set_volume(math.max({audio.get_volume() - 0.1, 0.0}))
    end

    if keyboard.b.pressed then
        if sound ~= nil then
            audio.stop()
            resources.delete(sound)
        end
        util.exit()
    end

    if keyboard.select.pressed then
        util.exit()
    end
end

function lilka.draw()
    display.set_font("9x15")
    display.set_text_bound(32, 32, display.width - 64, display.height - 32)
    display.set_text_color(WHITE);
    display.fill_screen(BLACK)
    local y = 32
    display.set_cursor(32, y)
	display.print(string.format("%dkB/%dkB", math.floor(util.free_ram() / 1024), math.floor(util.total_ram() / 1024)))

    y = y + 16
    display.set_cursor(32, y)
    display.print("MadPlayer")

    y = y + 16
    display.set_cursor(32, y)
    display.print("------------------------")

    y = y + 16
    display.set_cursor(32, y)
    display.print("A - Відтворення / пауза")

    y = y + 16
    display.set_cursor(32, y)
    display.print("UP / DOWN - Гучність")

    y = y + 16
    display.set_cursor(32, y)
    display.print("LEFT / RIGHT - Треки")

    y = y + 16
    display.set_cursor(32, y)
    display.print("B - Вихід")

    y = y + 16
    display.set_cursor(32, y)
    display.print("------------------------")

    y = y + 16
    display.set_cursor(32, y)

    local sound_size = 0
    if sound ~= nil then
        sound_size = sound.size
    end
    display.print(string.format("%s (%d)", sounds[sound_index], sound_size))

    y = y + 32
    display.set_cursor(32, y)
    display.print(string.format("Гучність: %f", audio.get_volume()))

    if not audio.is_playing() then
        y = y + 16
        display.set_cursor(32, y)
        display.print("Трек закінчився")
    end
    
end
