addLayer("corebooster", {
    name: "corebooster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CRB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        useful: new Decimal(0),
        e1: new Decimal(1),
        e2: new Decimal(1),
        e3: new Decimal(1),
        e4: new Decimal(1),
        e5: new Decimal(1),
    }},
    color: "#80e040",
    requires: new Decimal("1e30"), // Can be a function that takes requirement increases into account
    resource: "Core Boosters", // Name of prestige currency
    baseResource: "Number Cores", // Name of resource prestige is based on
    baseAmount() {return player.numbercore.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let base = new Decimal(3)
        if (hasAchievement("achievements", 53)) base = base.sub(0.5)
        return base
    }, // Prestige currency exponent
    base: 50,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        //exp 
        //other hypers
        //final
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "B", description: "B: Reset for Core Boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.corebooster.unlocked},
    passiveGeneration() {return false},
    onPrestige() {
        player.corebooster.points = player.corebooster.points.add(getResetGain("corebooster"))
        doReset("polygon", true)
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["points"];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() { return "You have " + format(player.numbercore.points) + " Number Cores"}],
        "blank",
        ["display-text", function() { return "<h3>You have " + format(player.corebooster.useful) + " useful Core Boosters, which...</h3>"}],
        ["display-text", function() { return "x" + format(player.corebooster.e1) + " to Shapes"}],
        ["display-text", function() { return "x" + format(player.corebooster.e2) + " to Division"}],
        ["display-text", function() {
            if (!hasAchievement("achievements", 53)) return ""
            return "/" + format(player.corebooster.e3) + " to Pentagon and Hexagon construction time"
        }],
        ["display-text", function() {
            if (!hasMilestone("primitive", 11)) return ""
            return "x" + format(player.corebooster.e4) + " to Points, Fundamentality, Operation Power, and Addition."
        }],
    ],

    update(diff){
        player.corebooster.useful = player.corebooster.points

        let e1b = player.corebooster.useful
        e1b = e1b.add(1).log(20).add(1)
        if (hasAchievement("achievements", 53)) e1b = e1b.pow(3)
        player.corebooster.e1 = e1b

        let e2b = player.corebooster.useful
        e2b = e2b.add(1).pow(0.5)
        if (hasAchievement("achievements", 53)) e1b = e1b.pow(2)
        player.corebooster.e2 = e2b

        let e3b = player.corebooster.useful
        e3b = e3b.add(1).pow(0.25)
        if (!hasAchievement("achievements", 53)) player.corebooster.e3 = new Decimal(1)
        else player.corebooster.e3 = e3b

        let e4b = player.corebooster.useful
        e4b = e4b.add(1).pow(new Decimal(13).mul(player.corebooster.useful))
        if (!hasMilestone("primitive", 11)) player.corebooster.e4 = new Decimal(1)
        else player.corebooster.e4 = e4b
    },
    tooltip() {return format(player.corebooster.points) + " Core Boosters (" + format(getNextAt("corebooster")) + " Number Cores for next Core Booster) - GAINING CORE BOOSTERS WILL FORCE POLYGON RESET."},
})