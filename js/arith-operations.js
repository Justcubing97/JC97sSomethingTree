addLayer("addition", {
    name: "addition", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF50FF",
    requires: new Decimal("1"), // Can be a function that takes requirement increases into account
    resource: "Addition", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.arithmetic.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        mult = mult.mul(player.arithmetic.points.div(10).add(1))
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade("arithmetic", 13)},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    passiveGeneration() {if (hasUpgrade("arithmetic", 13)) return 1},
    resetsNothing() {return true},
    upgrades: {
        11: {
            title: "placeholder",
            description: "?",
            cost: new Decimal("1e9999"),
        },
    },
})

addLayer("subtraction", {
    name: "subtraction", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "-", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF50FF",
    requires: new Decimal("1"), // Can be a function that takes requirement increases into account
    resource: "Subtraction", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.arithmetic.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        mult = mult.mul(player.arithmetic.points.div(10).add(1))
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade("arithmetic", 13)},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    passiveGeneration() {if (hasUpgrade("arithmetic", 13)) return 1},
    resetsNothing() {return true},
    upgrades: {
        11: {
            title: "placeholder",
            description: "?",
            cost: new Decimal("1e9999"),
        },
    },
})