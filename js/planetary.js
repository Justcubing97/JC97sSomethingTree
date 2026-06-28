addLayer("planetary", {
    name: "planetary", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PLF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        mercuryGenAmt: new Decimal(0),
        venusGenAmt: new Decimal(0),
        earthGenAmt: new Decimal(0),
        marsGenAmt: new Decimal(0),
        jupiterGenAmt: new Decimal(0),
        saturnGenAmt: new Decimal(0),
        uranusGenAmt: new Decimal(0),
        neptuneGenAmt: new Decimal(0),
        planetPower: new Decimal(0),
    }},
    color: "#80E0FF",
    requires: new Decimal("1e150"), // Can be a function that takes requirement increases into account
    resource: "Planetary Fragments", // Name of prestige currency
    baseResource: "Polygons", // Name of resource prestige is based on
    baseAmount() {return player.polygon.points}, // Get the current amount of baseResource
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
    row: 6, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "P", description: "P: Reset for Planetary Fragments", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.planetary.unlocked},
    passiveGeneration() {return false},
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
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes" }],
        "blank",
        "buyables",
    ],
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes" }],
                "blank",
                "upgrades",
            ],
        },
        "Generators": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes" }],
                "blank",
                "buyables",
            ],
        },
    },
    upgrades: {
        11: {
            title: "placeholder",
            description: "??? (NO EFFECT)",
            cost: new Decimal("10"),
        },
    },
    buyables: {
        11: {
            cost(x) {
                let base = new Decimal(1.5).pow(x)
                return base
            },
            title: "Mercury Generator",
            display() { return "Generates Planet Power based on its amount." + "\n" + "Amount: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = new Decimal(250)
                let effect = base.pow(x)
                if (player.dimension.points.gte(4)) effect = effect.pow(1.2)
                return effect
            },
            unlocked() {return true},
        },
    },

    update(diff){

    },
    tooltip() {return format(player.planetary.points) + " Planetary Fragments (+" + format(getResetGain("planetary")) + " Planetary Fragments on reset)"},
})