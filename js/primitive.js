addLayer("primitive", {
    name: "primitive", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PRM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00C8FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "Numbers", // Name of prestige currency
    baseResource: "Fundamentality", // Name of resource prestige is based on
    baseAmount() {return player.fundamental.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.33, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        if (hasMilestone("primitive", 4)) mult = mult.add(5)
        //mul
        if (hasUpgrade("primitive", 14)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 27)) mult = mult.mul(2)
        if (hasUpgrade("fundamental", 31)) mult = mult.mul(5)
        if (hasUpgrade("primitive", 16)) mult = mult.mul(upgradeEffect("primitive", 16))
        if (hasUpgrade("fundamental", 32)) mult = mult.mul(25)
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Numbers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.primitive.unlocked},
    layerDataReset() { if (hasMilestone("primitive", 2)) return ["23"]},
    upgrades: {
        11: {
            title: "Primitivity",
            description: "x5 Fundamentality and +5 Points.",
            cost: new Decimal(1),
        },
        12: {
            title: "Extension",
            description: "Add more Fundamental upgrades.",
            cost: new Decimal(40),
        },
        13: {
            title: "Repetition",
            description: "Unlock the first Fundamental buyable.",
            cost: new Decimal("1e6"),
        },
        14: {
            title: "Primitive Boost",
            description: "x5 Numbers, and Numbers boosts Points.",
            cost: new Decimal("500e6"),
            effect() { return new Decimal(player.primitive.points.logarithm(10)).add(1).pow(2) },
            effectDisplay() { return "Currently: x" + format(upgradeEffect(this.layer, this.id)) },
        },
        15: {
            title: "Preservation",
            description: "Keep the first 14 Fundamental upgrades on Primitive reset.",
            cost: new Decimal("2e14"),
        },
        16: {
            title: "Recursion",
            description: "Numbers boosts itself.",
            cost: new Decimal("1e15"),
            effect() { return new Decimal(player.primitive.points.pow(0.1)).add(1) },
            effectDisplay() { return "Currently: x" + format(upgradeEffect(this.layer, this.id)) },
        },
        17: {
            title: "Slowing down?",
            description: "Numbers boost Fundamentality after softcap.",
            cost: new Decimal("1.5e16"),
            effect() { return player.primitive.points.pow(0.2) },
            effectDisplay() { return "Currently: x" + format(upgradeEffect(this.layer, this.id)) },
        },
        21: {
            title: "Quality of Life Incoming!",
            description: "Keep Fundamental buyable 1, and reduce its scaling to x600.",
            cost: new Decimal("1.5e16"),
        },
    },
    milestones: {
        1: {
            requirementDescription: "25 Numbers",
            effectDescription: "x50 Points.",
            done() { return player.primitive.points.gte(25) },
        },

        2: {
            requirementDescription: "3000 Numbers",
            effectDescription: "Keep  \"Generation\" on Primitive reset and x100 Fundamentality.",
            done() { return player.primitive.points.gte(3000) },
        },

        3: {
            requirementDescription: "1e14 Numbers",
            effectDescription: "x3 Fundamentality and unlock Document 3.",
            done() { return player.primitive.points.gte("1e14") },
        },

        4: {
            requirementDescription: "1e19 Numbers",
            effectDescription: "x100 Points, Fundamentality, and +5 Numbers.",
            done() { return player.primitive.points.gte("1e19") },
        },
    }
})

