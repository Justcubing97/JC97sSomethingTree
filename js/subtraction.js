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
        if (hasUpgrade("fundamental", 42)) mult = mult.add(100)
        //mul
        mult = mult.mul(player.arithmetic.points.div(10).add(1))
        if (hasUpgrade("arithmetic", 21)) mult = mult.mul(upgradeEffect("arithmetic", 21))
        if (hasUpgrade("division", 11)) mult = mult.mul(upgradeEffect("division", 11))
        if (hasUpgrade("division", 13)) mult = mult.mul("1e30")
        //exp
        if (hasUpgrade("arithmetic", 15)) mult = mult.pow(1.1)
        if (hasMilestone("dimension", 3) && !inChallenge("arithmetic", 13) && !getClickableState("division", 11)) mult = mult.pow(1.5)
        if (inChallenge("arithmetic", 13)) mult = mult.pow(0.75)
        if (hasUpgrade("multiplication", 31)) mult = mult.pow(1.05)
        if (player.polygon.pentagons.gte(1)) mult = mult.pow(player.polygon.penEffect)
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade("arithmetic", 13) || hasMilestone("dimension", 3)},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    passiveGeneration() {if (hasUpgrade("arithmetic", 13)) return 1},
    resetsNothing() {return true},
    resetsNothing() {return true},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["upgrades"];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier in Stage 2
    },
    upgrades: {
        11: {
            title: "Nerfed Scalings!",
            description: "Fundamental buyable 2 scaling is reduced to x85000.",
            cost: new Decimal("50e3"),
        },
        12: {
            title: "Nerfed Softcap!",
            description: "+0.05 to the exponent of the Numbers softcap.",
            cost: new Decimal("15e6"),
        },
        13: {
            title: "Waiting Game",
            description: "x100 Points, Fundamentality (after softcap), Numbers (after softcap), and Operation Power.",
            cost: new Decimal("1e10"),
        },
        14: {
            title: "Multiplicative Reduction",
            description: "-1 to the exponent of Multiplication's scaling.",
            cost: new Decimal("1e70"),
        },
        15: {
            title: "A Better Divided Life",
            description: "The logarithm in Division's formula is base 5 instead of base 10.",
            cost: new Decimal("1e400"),
            unlocked(){return player.polygon.unlocked},
        },
        16: {
            title: "Opposite Addition",
            effect(){
                let base = player.subtraction.points.add(1)
                base = base.log(100).pow(0.1)
                return base || new Decimal(1)
            },
            effectDisplay(){return "x" + format(upgradeEffect(this.layer, this.id))},
            description: "Subtraction boosts Division at a really reduced rate.",
            cost: new Decimal("1e500"),
            unlocked(){return player.polygon.unlocked},
        },
        17: {
            title: "Breakthrough",
            description: "Divide all construction times by 3, x15 Division, x1e10 Number Cores, and +2 upgrades in the 7th row of TMT.",
            cost: new Decimal("1e650"),
            unlocked(){return hasMilestone("division", 3)},
        },
    },
    tooltip() {return format(player.subtraction.points) + " Subtraction (+" + format(getResetGain("subtraction")) + " Subtraction/sec)"},
})