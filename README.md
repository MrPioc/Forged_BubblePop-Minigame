# Forged Bubble Pop Minigame

This is a simple bubble popping minigame for FiveM (QBCore compatible).  
You can start the minigame directly or integrate it with other scripts.  

---

Framework : Qbcore/Qbox

## Usage

### From Client Scripts

You can start the minigame from **any client script** using the export:

```lua
exports['forged_bubblepop']:StartBubbleGame({
    count = 12,  -- Number of bubbles to pop
    time = 20,   -- Time limit in seconds
    onSuccess = function()
        print("Player won the minigame!")
        -- Add your success logic here
        -- Example: TriggerServerEvent("myScript:rewardPlayer")
    end,
    onFail = function()
        print("Player lost the minigame!")
        -- Add your failure logic here
    end
})
