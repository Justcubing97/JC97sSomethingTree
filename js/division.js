addLayer("division", {
    name: "division", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "÷", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resets: new Decimal(0),
        currencyMulti: new Decimal(1)
    }},
    color: "#FF50FF",

    requires() {
        return new Decimal ("1")
    }, // Can be a function that takes requirement increases into account
    resource: "Division", // Name of prestige currency
    baseResource: "Numbers", // Name of resource prestige is based on
    baseAmount() {return player.primitive.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
        return new Decimal (0.5)
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        if (hasMilestone("division", 1)) mult = mult.mul(2)
        if (hasUpgrade("multiplication", 43)) mult = mult.mul(5)
        if (hasMilestone("polygon", 8)) mult = mult.mul(3.5)
        if (hasMilestone("division", 3)) mult = mult.mul(5)
        if (hasUpgrade("multiplication", 62)) mult = mult.mul(15)
        if (player.dimension.points.gte(4)) mult = mult.mul(5)
        mult = mult.mul(player.corebooster.e1)
        //exp
        //other hypers
        player.division.currencyMulti = mult
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasMilestone("polygon", 5)},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },

    getResetGain(){
        let base = player.primitive.points
        if (base.lt("1e33")) return new Decimal(0)
        base = base.sub("1e33")
        base = base.add(1)
        if (hasUpgrade("subtraction", 15)) base = base.logarithm(5)
        else base = base.logarithm(10)
        base = base.sub(31)
        base = base.floor()
        base = base.mul(player.division.currencyMulti)
        return base
    },
    getNextAt(){
        let base = getResetGain("division")
        base = base.div(player.division.currencyMulti)
        base = base.add(32)
        if (hasUpgrade("subtraction", 15)) base = new Decimal(5).pow(base)
        else base = new Decimal(10).pow(base)
        base = base.sub(1)
        base = base.add("1e33")
        return "Next Division at " + format(base)
    },
    canReset() {
        if (player.division.resets.eq(0)) return true
        if (getClickableState("division", 11) != "Active") return false
        return true
    },
    prestigeNotify() { return false},
    prestigeButtonText() {
        if (getClickableState("division", 11) != "Active" && player.division.resets.eq(0)) return "You need to be in Long Division to reset. However, press this button anyway to initiate the layer."
        if (getClickableState("division", 11) != "Active") return "You need to be in Long Division to reset."
        let detect = player.primitive.points
        let text = "Reset for <b>+" + format(getResetGain("division")) + "</b> Division"
        if (detect.lt("1.1e33")) return "You start gaining Division at <b>1.1e33</b> Numbers."
        return text
    },
    onPrestige() {
        if (player.division.resets.eq(0)) player.division.points = player.division.points.sub(getResetGain("division"))
        player.division.resets = player.division.resets.add(1)
        setClickableState("division", 11, "Inactive")
    },
    
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        let keptResetAmount = player.division.resets

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["points", "upgrades", "milestones", "total"];

        // Stage 4, do the actual data reset
        if (resettingLayer == "division") doReset("polygon", true)
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
        player.division.resets = keptResetAmount
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.primitive.points) + " Numbers" }],
                ["display-text", function() {
                    let text = "You have " + format(player.division.points) + " Division"
                    return text
                }],
                ["display-text", function() {
                    if (getClickableState("division", 11) != "Active") return "-"
                    let text = getNextAt("division") + " Numbers."
                    return text
                }],
                "blank",
                ["infobox", "longDivBox"],
                "blank",
                ["clickables", [1]],
                "blank",
                "upgrades",
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.primitive.points) + " Numbers" }],
                ["display-text", function() { return "You have " + format(player.division.points) + " Division" }],
                ["display-text", function() {
                    if (getClickableState("division", 11) != "Active") return "-"
                    let text = getNextAt("division") + " Numbers."
                    return text
                }],
                "blank",
                "milestones",
            ],
        },
    },
    infoboxes: {
        longDivBox: {
            title: "Long Division",
            body() { return "Welcome to possibly the most inefficient operation in mathematics: Long Division. " +
                "Here, it's basically a time dilation. Think of Shark Incremental's Oceans, IMR's Big Rip, Algebraic Progression's Square Root, etc. " +
                "Fundamental buyables do not work. Addition boosters are heavily nerfed. ^0.3 to Points. Dimension milestones do not work. ^0.5 to Numbers. " +
                "The exponent nerfs are applied after everything else. Entering and exiting Long Division forces a Polygon reset. " +
                "However, all four operations will stay unlocked. <i> It is recommended to start doing Long Division at 10 Polygonifications. </i>" +
                "<b> There will be grinds. Tip: whenever something can be reached within 100 resets, GO FOR IT. </b>"
            }, //1e33 numbers is perfect! draw a line from prm to /
        },
    },
    clickables: {
        11: {
            title: "Enter Long Division",
            display() {
                if (getClickableState("division", 11) == "Active") return "You are in Long Division right now. Reset for Division to leave."
                return "You are not in Long Division right now."
            },
            canClick() {return true},
            onClick() {
                if (getClickableState("division", 11) != "Active") doReset("division", true)
                setClickableState("division", 11, "Active")
            },
        },
        12: {
            title: "Reset and Reenter",
            display() {
                if (getClickableState("division", 11) == "Active") return "Click this button to reenter Long Division after resetting."
                return "This button only works in Long Division."
            },
            canClick() {return true},
            onClick() {
                if (getClickableState("division", 11) != "Active") return
                doReset("division")
                setClickableState("division", 11, "Active")
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "10 Division",
            effectDescription: "x2 Multiplication and Division.",
            done() { return player.division.points.gte(10) },
        },
        2: {
            requirementDescription: "1,000 Division",
            effectDescription: "x10 Shapes.",
            done() { return player.division.points.gte("1e3") },
        },
        3: {
            requirementDescription: "250,000 Division",
            effectDescription: "Time for a Polygonal focus. Unlock the Constructor.",
            done() { return player.division.points.gte("2.5e5") },
            onComplete() {setClickableState("polygon", 11, "Triangle")},
        },
        4: {
            requirementDescription: "15,000,000 Division",
            effectDescription: "Triangles boost Squares and Points.",
            done() { return player.division.points.gte("15e6") },
            unlocked() {return hasMilestone("division", 3)},
        },
    },
    upgrades: {
        11: {
            title: "Embrace the Quotients",
            effect(){
                let base = player.division.points
                base = base.pow(0.25).add(1)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect("division", 11))},
            description: "Division boosts Addition, Subtraction, and Multiplication.",
            cost: new Decimal(1000),
        },
        12: {
            title: "Repeated Division",
            effect(){
                let base = player.division.points
                base = base.pow(2.25).add(1)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect("division", 12))},
            description: "Division boosts Operation Power and Points.",
            cost: new Decimal("25000"),
        },
        13: {
            title: "Subtraction is Under-used.",
            description: "x1e30 to Subtraction.",
            cost: new Decimal("5e6"),
        },
    },
    tooltip() {
        if (getClickableState("division", 11) == "Active") return format(player.division.points) + " Division (+" + format(getResetGain("division")) + " Division on reset)"
        return format(player.division.points) + " Division (not in Long Division)"
    },
})