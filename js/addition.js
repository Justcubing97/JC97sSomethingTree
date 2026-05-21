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
        if (hasUpgrade("primitive", 25)) mult = mult.add(upgradeEffect("primitive", 25))
        //mul
        mult = mult.mul(player.arithmetic.points.div(10).add(1))
        if (hasUpgrade("arithmetic", 21)) mult = mult.mul(upgradeEffect("arithmetic", 21))
        if (hasUpgrade("arithmetic", 23)) mult = mult.mul(100)
        //exp
        if (hasUpgrade("arithmetic", 15)) mult = mult.pow(1.1)
        if (hasMilestone("dimension", 3)) mult = mult.pow(1.2)
        
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
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

        // Stage 5, add back in the specific subfeatures you saved earlier in Stage 2
    },
    clickables: {
        11: {
            title: "Add to Fundamental",
            effect() {
                if (hasMilestone("primitive", 7)) return player.addition.points.pow(0.5).add(1).pow(1.6)
                return player.addition.points.pow(0.4).add(1).pow(1.5)
            },
            display() {return "Addition adds to Fundamentality base: +" + format(clickableEffect("addition", 11)) + " (" + getClickableState("addition", 11) + ")"},
            canClick() {return true},
            onClick() {
                setClickableState("addition", 11, "Active")

                setClickableState("addition", 12, "Inactive")
                setClickableState("addition", 13, "Inactive")
            },
        },

        12: {
            title: "Add to Primitive",
            effect() {
                if (hasMilestone("primitive", 7)) return player.addition.points.pow(0.5).add(1).pow(1.6)
                return player.addition.points.pow(0.4).add(1).pow(1.5)
            },
            display() {return "Addition adds to Numbers base: +" + format(clickableEffect("addition", 12)) + " (" + getClickableState("addition", 12) + ")"},
            canClick() {return true},
            onClick() {
                setClickableState("addition", 12, "Active")
            
                setClickableState("addition", 11, "Inactive")
                setClickableState("addition", 13, "Inactive")
            },
        },

        13: {
            title: "Add to Points",
            effect() {
                let base = player.addition.points.pow(0.4).add(1).pow(1.5)
                if (hasUpgrade("multiplication", 22)) base = base.mul(upgradeEffect("multiplication", 22))
                return base
            },
            display() {return "Addition adds to Points base: +" + format(clickableEffect("addition", 13)) + " (" + getClickableState("addition", 13) + ")"},
            canClick() {return true},
            onClick() {
                setClickableState("addition", 13, "Active")

                setClickableState("addition", 11, "Inactive")
                setClickableState("addition", 12, "Inactive")
            },
        },
    },
})