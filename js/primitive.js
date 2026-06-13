addLayer("primitive", {
    name: "primitive", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PRM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        softcapExponent: new Decimal(0),
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
        if (getClickableState("addition", 12) != "Inactive" && !inChallenge("arithmetic", 12)) mult = mult.add(clickableEffect("addition", 12))
        //mul
        if (hasUpgrade("primitive", 14)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 27)) mult = mult.mul(2)
        if (hasUpgrade("fundamental", 31)) mult = mult.mul(5)
        if (hasUpgrade("primitive", 16)) mult = mult.mul(upgradeEffect("primitive", 16))
        if (hasUpgrade("fundamental", 32)) mult = mult.mul(25)
        if (hasUpgrade("fundamental", 35)) mult = mult.mul(20)
        if (hasUpgrade("arithmetic", 11)) mult = mult.mul(100)
        if (hasUpgrade("primitive", 23)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 42)) mult = mult.mul("1e5")
        if (hasUpgrade("arithmetic", 23)) mult = mult.mul("1e5")
        if (hasUpgrade("multiplication", 43)) mult = mult.mul(25)
        if (getClickableState("division", 11) == "Active" && hasUpgrade("multiplication", 43)) mult = mult.mul(25)
        //exp 
        if (inChallenge("arithmetic", 11)) mult = mult.pow(0.8)
        if (hasUpgrade("fundamental", 41)) mult = mult.pow(upgradeEffect("fundamental", 41))
        if (inChallenge("arithmetic", 13)) mult = mult.pow(0.75)
        if (hasChallenge("arithmetic", 13)) mult = mult.pow(1.05)
        //other hypers

        //final
        if (getClickableState("division", 11) == "Active") mult = mult.pow(0.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    softcap() {return new Decimal("1e50")},
    directMult() {
        let dMult = new Decimal(1)
        if (hasUpgrade("subtraction", 13)) dMult = dMult.mul(100)
        if (hasUpgrade("multiplication", 42)) dMult = dMult.mul("1e10")

        if (hasUpgrade("multiplication", 32)) dMult = dMult.pow(1.05)
        if (hasUpgrade("primitive", 27)) dMult = dMult.pow(1.5)
        if (player.dimension.points.gte(4)) dMult = dMult.pow(1.01)
        dMult = dMult.mul(buyableEffect("numbercore", 12))
        return dMult
    },
    softcapPower() {
        let power = new Decimal(0.5)
        if (hasUpgrade("subtraction", 12)) power = power.add(0.05)
        if (player.primitive.points.gte("1e1000")) power = power.div(1.45)
        player.primitive.softcapExponent = power
        return power
    },
    effectDescription() {
        let text = ""
        if (player.primitive.points.gte("1e1000")) text = text + "supercapped by ^" + player.primitive.softcapExponent.toFixed(6) + " to its gain."
        else if (player.primitive.points.gte("1e50")) text = text + "softcapped by ^" + player.primitive.softcapExponent.toFixed(6) + " to its gain."
        return text
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Numbers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.primitive.unlocked},
    layerDataReset() { if (hasMilestone("primitive", 2)) return ["23"]},
    passiveGeneration() {if (hasUpgrade("arithmetic", 12)) return 1},
    deactivated() {return inChallenge("arithmetic", 21)},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasAchievement("achievements", 24)) keptUpgrades.push(11, 12, 13, 14, 15, 16, 17, 21, 22, 23)
        if (hasAchievement("achievements", 34)) keptUpgrades.push(24)
        if (hasMilestone("polygon", 3)) keptUpgrades.push(25)
        if (hasMilestone("polygon", 9)) keptUpgrades.push(26, 27)

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        if (hasMilestone("polygon", 1)) keep.push("milestones");

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    upgrades: {
        11: {
            title: "Primitivity",
            description: "x10 Fundamentality and +5 Points.",
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
            cost: new Decimal("250e6"),
            effect() {
                let effect = player.primitive.points
                if (hasMilestone("dimension", 2) && !inChallenge("arithmetic", 13) && !getClickableState("division", 11)) effect = new Decimal(effect.add(1).logarithm(7)).add(1).pow(3)
                else if (hasMilestone("primitive", 5)) effect = new Decimal(effect.add(1).logarithm(6)).add(1).pow(3)
                else effect = new Decimal(effect.add(1).logarithm(10)).add(1).pow(2)

                if (hasMilestone("addition", 1)) effect = effect.pow(5)
                if (hasUpgrade("multiplication", 52)) effect = effect.pow(upgradeEffect("multiplication", 52))
                return effect
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        15: {
            title: "Preservation",
            description: "Keep the first 14 Fundamental upgrades on Primitive reset.",
            cost: new Decimal("1e14"),
            unlocked() {return hasUpgrade("primitive", 14) || player.arithmetic.unlocked},
        },
        16: {
            title: "Recursion",
            description: "Numbers boosts itself.",
            cost: new Decimal("1e20"),
            effect() {
                let base = player.primitive.points
                if (hasMilestone("dimension", 2) && !inChallenge("arithmetic", 13) && !getClickableState("division", 11)) base = base.pow(0.2).add(1)
                else base = base.pow(0.1).add(1)
                base = base.pow(buyableEffect("numbercore", 12))
                return base
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
            unlocked() {return hasUpgrade("primitive", 14) || player.arithmetic.unlocked},
        },
        17: {
            title: "Slowing down?",
            description: "Numbers boost Fundamentality after softcap.",
            cost: new Decimal("5e22"),
            effect() {
                if (hasMilestone("primitive", 5)) {
                    return new Decimal(player.primitive.points.pow(0.4)).add(1)
                } else {
                    return new Decimal(player.primitive.points.pow(0.2)).add(1)
                }
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
            unlocked() {return hasUpgrade("primitive", 14) || player.arithmetic.unlocked},
        },
        21: {
            title: "Quality of Life Incoming!",
            description: "Keep Fundamental buyable 1, and reduce its scaling to x600.",
            cost: new Decimal("5e25"),
            unlocked() {return hasUpgrade("primitive", 14) || player.arithmetic.unlocked},
        },
        22: {
            title: "Repetition+",
            description: "Unlock the second Fundamental buyable.",
            cost: new Decimal("1e27"),
            unlocked() {return hasUpgrade("primitive", 14) || player.arithmetic.unlocked},
        },
        23: {
            title: "It's Been a While",
            description: "Simple! x1e10 Points and x5 Numbers.",
            cost: new Decimal("1e55"),
            unlocked() {return hasMilestone("primitive", 6) || player.polygon.unlocked},
        },
        24: {
            title: "Minuscule Boost",
            description: "+2 to Fundamentality softcap logarithm base.",
            cost: new Decimal("1e58"),
            unlocked() {return hasMilestone("primitive", 6) || player.polygon.unlocked},
        },
        25: {
            title: "Ran Out of Name Ideas",
            effect() {return new Decimal(player.primitive.points.pow(0.07)).add(1)},
            effectDisplay() {return "+" + format(upgradeEffect(this.layer, this.id))},
            description: "Numbers boost Addition base.",
            cost: new Decimal("1e111"),
            unlocked() {return hasMilestone("primitive", 6) || player.polygon.unlocked},
        },
        26: {
            title: "The Largest Cost Gap?",
            description: "x1e10 Addition and x100 Operation Power.",
            cost: new Decimal("1e615"),
            unlocked() {return hasUpgrade("multiplication", 42) || hasMilestone("polygon", 9)},
        },
        27: {
            title: "SUPERCAP OF DOOM",
            description: "^1.5 Numbers after softcap.",
            cost: new Decimal("1e1000"),
            unlocked() {return hasUpgrade("multiplication", 42) || hasMilestone("polygon", 9)},
        },
    },
    milestones: {
        1: {
            requirementDescription: "1: 10 Numbers",
            effectDescription: "x50 Points.",
            done() { return player.primitive.points.gte(10) },
        },

        2: {
            requirementDescription: "2: 100,000 Numbers",
            effectDescription: "Keep  \"Generation\" on Primitive reset and x100 Fundamentality.",
            done() { return player.primitive.points.gte("1e5") },
        },

        3: {
            requirementDescription: "3: 1e11 Numbers",
            effectDescription: "x25 Fundamentality and unlock Document 3.",
            done() { return player.primitive.points.gte("1e11") },
        },

        4: {
            requirementDescription: "4: 1e24 Numbers",
            effectDescription: "x100 Points, Fundamentality, and +5 Numbers.",
            done() { return player.primitive.points.gte("1e24") },
        },

        5: {
            requirementDescription: "5: 1e30 Numbers",
            effectDescription: "Improve \"Slowing down?\" and \"Primitive Boost.\" x10 Numbers.",
            done() { return player.primitive.points.gte("1e30") },
        },

        6: {
            requirementDescription: "6: 1e48 Numbers",
            effectDescription: "Unlock more Fundamental and Primitive upgrades.",
            done() { return player.primitive.points.gte("1e48") },
            unlocked() {return player.arithmetic.unlocked},
        },

        7: {
            requirementDescription: "7: 1e60 Numbers",
            effectDescription: "Improve Addition boosters to Fundamentality and Numbers. Unlock a third booster that boosts Points (it is not affected by this milestone).",
            done() { return player.primitive.points.gte("1e60") },
            unlocked() {return player.arithmetic.unlocked},
        },
        8: {
            requirementDescription: "8: 1e93 Numbers",
            effectDescription() {
                let text = "A trigintillion! For every Fundamental buyable 3, +"
                let base = new Decimal(0.1)
                if (hasUpgrade("multiplication", 11)) base = base.add(0.4)
                if (hasUpgrade("polygon", 12)) base = base.add(upgradeEffect("polygon", 12))

                text = text + format(base) + " to Fundamental buyable 1's base. Currently: +" + format(getBuyableAmount("fundamental", 13).mul(base))
                return text
            },
            done() { return player.primitive.points.gte("1e93") },
            unlocked() {return player.arithmetic.unlocked},
        },
    },
    branches: [["arithmetic", "#FFFFFF", 10], ["dimension", "#C0FFC0", 5], ["division", "#FF50FF", 5], ["numbercore", "#00e0c0", 5]],
    tooltip() {return format(player.primitive.points) + " Numbers (+" + format(getResetGain("primitive")) + " Numbers on reset)"},
})

