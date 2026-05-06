-- mqtt/pubsub.lua
-- Demonstrates mqtt.connect(), mqtt.subscribe(), mqtt.publish(), mqtt.receive().
-- Pair with broker.py running on a Linux machine on the same network,
-- OR point BROKER_HOST at any real MQTT broker (e.g. Mosquitto).
--
-- Topic layout:
--   lilka/out   — device publishes sensor readings here
--   lilka/in    — device subscribes here for commands

local BROKER_HOST = "192.168.68.218"
local BROKER_PORT = 1883
local CLIENT_ID   = "lilka-demo"
local PUB_TOPIC   = "lilka/out"
local SUB_TOPIC   = "lilka/in"
local ITERATIONS  = 20   -- publish this many readings then disconnect

-- Connect to broker
local client, err = mqtt.connect({
    host      = BROKER_HOST,
    port      = BROKER_PORT,
    client_id = CLIENT_ID,
    keepalive = 30,
})
if not client then
    print("MQTT connect failed:", err)
    return
end

-- esp_mqtt_client_start() is async — wait until MQTT_EVENT_CONNECTED fires
local CONNECT_TIMEOUT_S = 10
local waited = 0
while not mqtt.connected(client) and waited < CONNECT_TIMEOUT_S do
    util.sleep(0.1)
    waited = waited + 0.1
end
if not mqtt.connected(client) then
    print("MQTT connect timeout (no broker at " .. BROKER_HOST .. ":" .. BROKER_PORT .. ")")
    mqtt.disconnect(client)
    return
end
print("Connected to broker", BROKER_HOST)

-- Subscribe to command topic
local ok, sub_err = mqtt.subscribe(client, SUB_TOPIC, 1)
if not ok then
    print("Subscribe failed:", sub_err)
    mqtt.disconnect(client)
    return
end
print("Subscribed to", SUB_TOPIC)

-- Main loop: publish a reading, then drain incoming messages
local seq = 0
while seq < ITERATIONS do
    -- Publish a fake sensor reading
    seq = seq + 1
    local payload = string.format('{"seq":%d,"temp":%.1f}', seq, 20.0 + seq * 0.3)
    local pub_ok, pub_err = mqtt.publish(client, PUB_TOPIC, payload, 1, false)
    if pub_ok then
        print("PUB", PUB_TOPIC, payload)
    else
        print("Publish failed:", pub_err)
    end

    -- Drain incoming messages (non-blocking)
    local msg = mqtt.receive(client)
    while msg do
        print("RCV", msg.topic, "→", msg.payload)
        -- React to commands
        if msg.payload == "reset" then
            seq = 0
            print("Counter reset by remote command.")
        end
        msg = mqtt.receive(client)
    end

    -- Small delay between publishes (vTaskDelay equivalent in Lua runtime)
    -- The Lua runner sleeps between frames; for a tighter loop use util.sleep_ms.
    -- util.sleep_ms(500)  -- uncomment if util module is available
end

print("Done. Disconnecting.")
mqtt.disconnect(client)
