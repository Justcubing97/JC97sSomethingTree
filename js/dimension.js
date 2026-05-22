addLayer("dimension", {
    name: "dimension", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DIM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#A0FFA0",
    requires: new Decimal("1e60"), // Can be a function that takes requirement increases into account
    resource: "Dimensions", // Name of prestige currency
    baseResource: "Numbers", // Name of resource prestige is based on
    baseAmount() {return player.primitive.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 8, // Prestige currency exponent
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
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for a Dimension", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.dimension.unlocked},
    canBuyMax() {return false},
    resetDescription: "Dimensionize your progress for ",
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        //if (someOtherCondition) keep.push("milestones");

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    milestones: {
        1: {
            requirementDescription: "1st Dimension",
            effectDescription: "Improve Fundamental buyable 1 SIGNIFICANTLY.",
            done() { return player.dimension.points.gte(1) },
        },
        2: {
            requirementDescription: "2nd Dimension",
            effectDescription: "Improve \"Primitive Boost\" and \"Recursion.\"",
            done() { return player.dimension.points.gte(2) },
        },
        3: {
            requirementDescription: "3rd Dimension",
            effectDescription: "Keep Addition and Subtraction unlocked on Dimensionize, and improve their formulas.",
            done() { return player.dimension.points.gte(3) },
        },
    },
});