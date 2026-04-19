addLayer("fundamental", {
    name: "fundamental", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FND", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFC800",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Fundamentality", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        if (hasUpgrade("fundamental", 15)) mult = mult.add(2)
        //mul
        if (hasUpgrade("fundamental", 11)) mult = mult.mul(2)
        if (hasUpgrade("fundamental", 14)) mult = mult.mul(5)
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for Fundamentality", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.fundamental.unlocked},
    upgrades: {
        11: {
            title: "The First REAL Upgrade",
            description: "x2 Points and Fundamentality.",
            cost: new Decimal(1),
        },

        12: {
            title: "The Second REAL Upgrade",
            description: "x3 Points. And maybe something else...",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("fundamental", 11)},
        },

        13: {
            title: "Learn the Order of Boosts",
            description: "+1 Points. (operations in order: +, *, ^, etc.)",
            cost: new Decimal(25),
            unlocked() {return hasUpgrade("fundamental", 12)},
        },

        14: {
            title: "The Beginning of the Exponential",
            description: "x5 Fundamentality.",
            cost: new Decimal(40),
            unlocked() {return hasUpgrade("fundamental", 13)},
        },

        15: {
            title: "The 5th Upgrade",
            description: "x3 Points and +2 Fundamentality.",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade("fundamental", 14)},
        },

        16: {
            title: "The Largest Boost so far",
            description: "x15 Points! And +5 Unlock Points.",
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade("fundamental", 15)},
        },
    },
})