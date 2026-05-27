addLayer("numbercore", {
    name: "numbercore", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NCR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00e0c0",
    requires: new Decimal("1e1000"), // Can be a function that takes requirement increases into account
    resource: "Number Cores", // Name of prestige currency
    baseResource: "Numbers", // Name of resource prestige is based on
    baseAmount() {return player.primitive.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
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
        {key: "c", description: "C: Reset for Number Cores", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.numbercore.unlocked},
    passiveGeneration() {if (player.numbercore.unlocked) return 1},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    upgrades: {
        11: {
            title: "placeholder",
            description: "???",
            cost: new Decimal("1e234987234987234"),
        },
    },
    tooltip() {return format(player.numbercore.points) + " Number Cores (+" + format(getResetGain("numbercore")) + " Number Cores on reset)"},
})

