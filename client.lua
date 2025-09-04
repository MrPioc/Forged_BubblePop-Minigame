local isPlaying = false
local onSuccess, onFail = nil, nil

RegisterCommand("testbub", function()
    exports['forged_bubblepop']:StartBubbleGame({
        count = 10,
        time = 15,
        onSuccess = function()
            print("Minigame success!")
        end,
        onFail = function()
            print("Minigame failed!")
        end
    })
end)

RegisterNUICallback("bubbleSuccess", function(_, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "stop" })
    isPlaying = false
    if onSuccess then onSuccess() end
    cb("ok")
end)

RegisterNUICallback("bubbleFail", function(_, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "stop" })
    isPlaying = false
    if onFail then onFail() end
    cb("ok")
end)

exports("StartBubbleGame", function(config)
    if isPlaying then return end
    isPlaying = true
    onSuccess = config.onSuccess
    onFail = config.onFail

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "start",
        count = config.count or 10,
        time = config.time or 15
    })
end)
