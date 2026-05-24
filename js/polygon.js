addLayer("polygon", {
    name: "polygon", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PLY", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resets: new Decimal(0),
        effect: new Decimal(0),
    }},
    color: "#2050FF",
    requires: new Decimal("1e60"), // Can be a function that takes requirement increases into account
    resource: "Shapes", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.arithmetic.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0333, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        //exp
        //other hypers
        //final effects
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Shapes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.polygon.unlocked},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    resetDescription: "Polygonify for ",
    onPrestige() {player.polygon.resets = player.polygon.resets.add(1)},
    effect() {
        player.polygon.effect = player.polygon.points.add(1).log10().div(10).add(1.01)
    },
    effectDescription() {
        return "raising Fundamental buyable 1's effect, Multiplication's effect, <br> and \"Arithmetic Combination\" to ^" + format(player.polygon.effect)
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() { return "You have " + format(player.polygon.points) + " Operation Power" }],
        ["display-text", function() { return "You have Polygonified " + format(player.polygon.resets) + " time(s)" }],
        "blank",
        "milestones",
        "blank",
        "upgrades",
    ],
    milestones: {
        1: {
            requirementDescription: "1 Polygonification",
            effectDescription: "Keep all Primitive milestones completed.",
            done() { return player.polygon.resets.gte("1") },
            unlocked() {return true},
        },
        2: {
            requirementDescription: "2 Polygonifications",
            effectDescription: "Keep all Arithmetic Challenges unlocked.",
            done() { return player.polygon.resets.gte("2") },
            unlocked() {return true},
        },
        3: {
            requirementDescription: "3 Polygonifications",
            effectDescription: "Keep Fundamental upgrades 1-23, Primitive upgrades 1-12, and Arithmetic upgrades 1-7.",
            done() { return player.polygon.resets.gte("3") },
            unlocked() {return true},
        },
        4: {
            requirementDescription: "4 Polygonifications",
            effectDescription: "The Addition booster for Fundamentality is always active. Passively generate 100% of pending Operation Power per second.",
            done() { return player.polygon.resets.gte("4") },
            unlocked() {return true},
        },
        5: {
            requirementDescription: "5 Polygonifications",
            effectDescription: "Unlock Division. (NOT IMPLEMENTED)",
            done() { return player.polygon.resets.gte("5") },
            unlocked() {return true},
        },
    },
    upgrades: {
        11: {
            title: "Powerful Boosts",
            description: "x1000 Operation Power and ^1.3 Fundamentality after softcap. (NOT IMPLEMENTED)",
            cost: new Decimal(100),
        },
    },
    tooltip() {return format(player.polygon.points) + " Shapes (+" + format(getResetGain("polygon")) + " Shapes on reset)"},
})