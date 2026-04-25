addLayer("arithmetic", {
    name: "arithmetic", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ARH", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF0080",
    requires: new Decimal("1e37"), // Can be a function that takes requirement increases into account
    resource: "Operation Power", // Name of prestige currency
    baseResource: "Numbers", // Name of resource prestige is based on
    baseAmount() {return player.primitive.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for Operation Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.arithmetic.unlocked},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    upgrades: {
        11: {
            title: "More Math?",
            description: "x100 Points, Fundamentality (after softcap), and Numbers.",
            cost: new Decimal(1),
        },
        12: {
            title: "Number Influx",
            description: "Passively generate 100% of pending Numbers per second and keep Fundamentality generation.",
            cost: new Decimal(3),
        },
        13: {
            title: "Operation Gain",
            description: "Start gaining Addition and Subtraction. (HAVE AT LEAST 1 OPERATION POWER AFTER THIS)",
            cost: new Decimal(10),
        },
    },
    branches: ["addition", "subtraction"],
})