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
        if (getClickableState("addition", 14) != "Inactive" && !inChallenge("arithmetic", 12)) mult = mult.add(clickableEffect("addition", 14))
        //mul
        mult = mult.mul(buyableEffect("numbercore", 11))
        mult = mult.mul(player.polygon.squEffect)
        if (player.dimension.points.gte(4)) mult = mult.mul(100)
        if (hasMilestone("addition", 3)) mult = mult.mul(player.division.points.add(1).pow(0.3))
        if (hasUpgrade("polygon", 15)) mult = mult.mul(upgradeEffect("polygon", 15))
        if (hasUpgrade("subtraction", 17)) mult = mult.mul("1e10")
        if (hasChallenge("arithmetic", 22)) mult = mult.mul("1e10")
        //exp
        if (hasAchievement("achievements", 53)) mult = mult.pow(1.2)
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
    layerShown(){return player.numbercore.unlocked || player.dimension.points.gte(4)},
    passiveGeneration() {if (player.numbercore.unlocked) return 1},
    onPrestige() {player.numbercore.points = player.numbercore.points.sub(getResetGain("numbercore"))},
    resetsNothing() {return true},
    prestigeButtonText() {return "This button does absolutely nothing. Number Cores are gained passively, okay?"},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["buyables"];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    buyables: {
        11: {
            cost(x) {
                let base = new Decimal("3")
                let expscal = new Decimal("0")
                if (getBuyableAmount(this.layer, this.id).gte(10)) base = base.add("10")
                if (getBuyableAmount(this.layer, this.id).gte(20)) base = base.add("12")
                if (getBuyableAmount(this.layer, this.id).gte(30)) base = base.add("14")
                if (getBuyableAmount(this.layer, this.id).gte(40)) base = base.add("16"); expscal = expscal.add(2.5)
                if (getBuyableAmount(this.layer, this.id).gte(50)) base = base.add("20"); expscal = expscal.add(5)
                if (getBuyableAmount(this.layer, this.id).gte(60)) base = base.mul("2"); expscal = expscal.add(5)
                return base.pow(x.add(expscal)).mul("10")
            },
            title: "Core Condensation",
            display() { return "x2 Number Cores per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal("2").pow(x) },
        },
        12: {
            cost(x) {
                let base = new Decimal("5")
                let expscal = new Decimal("0")
                if (getBuyableAmount(this.layer, this.id).gte(10)) base = base.add("10")
                if (getBuyableAmount(this.layer, this.id).gte(20)) base = base.add("12")
                if (getBuyableAmount(this.layer, this.id).gte(30)) base = base.add("14")
                if (getBuyableAmount(this.layer, this.id).gte(40)) base = base.add("16"); expscal = expscal.add(2.5)
                if (getBuyableAmount(this.layer, this.id).gte(50)) base = base.add("20"); expscal = expscal.add(5)
                if (getBuyableAmount(this.layer, this.id).gte(60)) base = base.mul("2"); expscal = expscal.add(5)
                return base.pow(x.add(expscal)).mul("10")
            },
            title: "Numerical Overflow",
            display() { return "^1.01 to \"Recursion\"'s effect and Numbers after softcap per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: ^" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal("1.01").pow(x) },
        },
        13: {
            cost(x) {
                let base = new Decimal("10")
                let expscal = new Decimal("0")
                if (getBuyableAmount(this.layer, this.id).gte(10)) base = base.add("10")
                if (getBuyableAmount(this.layer, this.id).gte(20)) base = base.add("12")
                if (getBuyableAmount(this.layer, this.id).gte(30)) base = base.add("14")
                if (getBuyableAmount(this.layer, this.id).gte(40)) base = base.add("16"); expscal = expscal.add(2.5)
                if (getBuyableAmount(this.layer, this.id).gte(50)) base = base.add("20"); expscal = expscal.add(5)
                if (getBuyableAmount(this.layer, this.id).gte(60)) base = base.mul("2"); expscal = expscal.add(5)
                return base.pow(x.add(expscal)).mul("10")
            },
            title: "Long Division Boost",
            display() { return "x1e10 Points per purchase. <i>This buyable only has effect in Long Division.</i>" + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal("1e10").pow(x) },
        },
        21: {
            cost(x) {
                let base = new Decimal("35")
                let expscal = new Decimal("0")
                if (getBuyableAmount(this.layer, this.id).gte(10)) base = base.add("10")
                if (getBuyableAmount(this.layer, this.id).gte(20)) base = base.add("12")
                if (getBuyableAmount(this.layer, this.id).gte(30)) base = base.add("14")
                if (getBuyableAmount(this.layer, this.id).gte(40)) base = base.add("16"); expscal = expscal.add(2.5)
                if (getBuyableAmount(this.layer, this.id).gte(50)) base = base.add("20"); expscal = expscal.add(5)
                if (getBuyableAmount(this.layer, this.id).gte(60)) base = base.mul("2"); expscal = expscal.add(5)
                return base.pow(x.add(expscal)).mul("1e10")
            },
            title: "Addition Booster Booster",
            display() { return "x100 to the effect of the first three Addition boosters per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone("division", 3)},
            effect(x) { return new Decimal("100").pow(x) },
        },
        22: {
            cost(x) {
                let base = new Decimal("50")
                if (getBuyableAmount(this.layer, this.id).gte(10)) base = base.add("25")
                if (getBuyableAmount(this.layer, this.id).gte(20)) base = base.add("50")
                if (getBuyableAmount(this.layer, this.id).gte(30)) base = base.add("75")
                if (getBuyableAmount(this.layer, this.id).gte(40)) base = base.add("150")
                if (getBuyableAmount(this.layer, this.id).gte(50)) base = base.add("200")
                if (getBuyableAmount(this.layer, this.id).gte(60)) base = base.mul("500")
                return new Decimal(base).pow(x).mul("1e42")
            },
            title: "Improved Tools",
            display() { return "x1.5 to the effects of the straightedge and compass, and /1.2 to their costs per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()[0]) + ", /" + format(this.effect()[1]) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade("arithmetic", 31)},
            effect(x) { return [new Decimal("1.5").pow(x), new Decimal("1.2").pow(x)] },
        },
    },
    branches: [["corebooster", "#80e040", 5]],
    tooltip() {return format(player.numbercore.points) + " Number Cores (+" + format(getResetGain("numbercore")) + " Number Cores/sec)"},
})

