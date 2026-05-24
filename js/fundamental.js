addLayer("fundamental", {
    name: "fundamental", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FND", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        softcapExponent: new Decimal(0)
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
        if (getClickableState("addition", 11) == "Active" && !inChallenge("arithmetic", 12)) mult = mult.add(clickableEffect("addition", 11))
        //mul
        if (hasUpgrade("fundamental", 11)) mult = mult.mul(2)
        if (hasUpgrade("fundamental", 14)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 21)) mult = mult.mul(upgradeEffect("fundamental", 21))
        if (hasUpgrade("primitive", 11)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 25)) mult = mult.mul(upgradeEffect("fundamental", 25))
        if (!inChallenge("arithmetic", 11)) mult = mult.mul(buyableEffect("fundamental", 11))
        if (hasMilestone("primitive", 4)) mult = mult.mul(100)
        if (hasUpgrade("subtraction", 13)) mult = mult.mul(100)
        //exp
        if (inChallenge("arithmetic", 13)) mult = mult.pow(0.75)
        if (hasChallenge("arithmetic", 13)) mult = mult.pow(1.05)
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for Fundamentality", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.fundamental.unlocked},
    passiveGeneration() {if (hasUpgrade("fundamental", 23) || hasUpgrade("arithmetic", 12)) return 1},
    softcap() {return new Decimal("1e50")},
    directMult() {
        let dMult = new Decimal(1)
        if (hasUpgrade("primitive", 17)) dMult = dMult.mul(upgradeEffect("primitive", 17))
        if (hasUpgrade("fundamental", 32)) dMult = dMult.mul(250)
        if (hasUpgrade("arithmetic", 11)) dMult = dMult.mul(100)
        if (hasUpgrade("subtraction", 13)) dMult = dMult.mul(100)
        if (hasUpgrade("arithmetic", 23)) dMult = dMult.mul(100)

        if (hasUpgrade("fundamental", 34)) dMult = dMult.pow(1.5)
        if (hasUpgrade("multiplication", 31)) dMult = dMult.pow(1.2)
        return dMult
    },
    softcapPower() {
        if (player.fundamental.points.gte("1e50")) {
            let numerator = new Decimal(1)
            if (hasUpgrade("fundamental", 31)) numerator = numerator.add(10)
            if (hasUpgrade("fundamental", 36)) numerator = numerator.add(5)

            let power = numerator

            if (hasUpgrade("primitive", 24)) power = power.div(new Decimal(1).add(player.fundamental.points.div("1e50").logarithm(12)))
            else power = power.div(new Decimal(1).add(player.fundamental.points.div("1e50").logarithm(10)))
            if (hasUpgrade("arithmetic", 16)) power = power.add(new Decimal(0.1))
            if (player.fundamental.points.gte("1e500")) power = power.div(1.1)
            player.fundamental.softcapExponent = power
            return power
        }
        return (new Decimal(1)) 
    },
    effectDescription() {
        let text = ""
        if (player.fundamental.points.gte("1e500")) text = text + "supercapped by ^" + player.fundamental.softcapExponent.toFixed(6) + " to its gain."
        else if (player.fundamental.points.gte("1e50")) text = text + "softcapped by ^" + player.fundamental.softcapExponent.toFixed(6) + " to its gain."
        else return
        return text
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasMilestone("primitive", 2)) keptUpgrades.push(23)
        if (hasUpgrade("primitive", 15) || hasAchievement("achievements", 24)) keptUpgrades.push(11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27)
        if (hasAchievement("achievements", 24)) keptUpgrades.push(31, 32, 33, 34, 35, 36)
        if (hasAchievement("achievements", 34)) keptUpgrades.push(37)

        let keptBuyables = []
        if (hasUpgrade("primitive", 21) || hasUpgrade("arithmetic", 16)) keptBuyables.push(getBuyableAmount("fundamental", 11))
        if (hasUpgrade("arithmetic", 16)) keptBuyables.push(getBuyableAmount("fundamental", 12))
        if (hasAchievement("achievements", 34)) keptBuyables.push(getBuyableAmount("fundamental", 13))

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        //if (someOtherCondition) keep.push("milestones");

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
        setBuyableAmount("fundamental", 11, keptBuyables[0] || new Decimal(0))
        setBuyableAmount("fundamental", 12, keptBuyables[1] || new Decimal(0))
        setBuyableAmount("fundamental", 13, keptBuyables[2] || new Decimal(0))
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function(){
                        if (!hasUpgrade("fundamental", 23) || !hasUpgrade("arithmetic", 12)) return
                        let text = "You are gaining "
                        text = text + format(getResetGain(this.layer)) + " Fundamentality per second"
                        return text
                    }
                ],
                "blank",
                "upgrades",
            ],
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function(){
                        if (!hasUpgrade("fundamental", 23) || !hasUpgrade("arithmetic", 12)) return
                        let text = "You are gaining "
                        text = text + format(getResetGain(this.layer)) + " Fundamentality per second"
                        return text
                    }
                ],
                "blank",
                "buyables",
            ],
        },
    },
    upgrades: {
        11: {
            title: "The First REAL Upgrade",
            description: "x2 Points and Fundamentality.",
            cost: new Decimal(1),
        },

        12: {
            title: "The Second REAL Upgrade",
            description: "x3 Points. And maybe something else...",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("fundamental", 11) || player.primitive.unlocked},
        },

        13: {
            title: "Learn the Order of Boosts",
            description: "+1 Points. (operations in order: +, *, ^, etc.)",
            cost: new Decimal(15),
            unlocked() {return hasUpgrade("fundamental", 11) || player.primitive.unlocked},
        },

        14: {
            title: "The Beginning of the Exponential",
            description: "x5 Fundamentality.",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade("fundamental", 11) || player.primitive.unlocked},
        },

        15: {
            title: "The 5th Upgrade",
            description: "x3 Points and +2 Fundamentality.",
            cost: new Decimal(150),
            unlocked() {return hasUpgrade("fundamental", 11) || player.primitive.unlocked},
        },

        16: {
            title: "The Largest Boost so far",
            description: "x15 Points! And +5 Points because why not.",
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade("fundamental", 11) || player.primitive.unlocked},
        },

        17: {
            title: "Progressing",
            description: "Fundamentality boosts Points.",
            cost: new Decimal(2500),
            unlocked() {return hasUpgrade("fundamental", 11) || player.primitive.unlocked},
            effect() {
                if (hasUpgrade("fundamental", 22)) {
                    if (inChallenge("arithmetic", 11)) return player[this.layer].points.add(1).pow(0.75)
                    return player[this.layer].points.add(1).pow(0.75).pow(buyableEffect("fundamental", 12))
                } else {
                    if (inChallenge("arithmetic", 11)) return player[this.layer].points.add(1).pow(0.33)
                    return player[this.layer].points.add(1).pow(0.33).pow(buyableEffect("fundamental", 12))
                }
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },

        21: {
            title: "Mutual Relationship",
            description: "Points boosts Fundamentality.",
            cost: new Decimal(25000),
            unlocked() {return hasUpgrade("fundamental", 17) || player.primitive.unlocked},
            effect() {
                if (!inChallenge("arithmetic", 11)) return player.points.add(1).pow(0.25)
                return player.points.add(1).pow(0.25).pow(buyableEffect("fundamental", 12))
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },

        22: {
            title: "Improving the Past",
            description: "\"Progressing\" is improved.",
            cost: new Decimal(1000000),
            unlocked() {return hasUpgrade("fundamental", 17) || player.primitive.unlocked},
        },

        23: {
            title: "Generation",
            description: "Passively generate 100% of pending Fundamentality per second.",
            cost: new Decimal("1e9"),
            unlocked() {return hasUpgrade("fundamental", 17) || player.primitive.unlocked},
        },

        24: {
            title: "The Next Layer",
            description: "x100 Unlock Points.",
            cost: new Decimal("1e11"),
            unlocked() {return hasUpgrade("fundamental", 17) || player.primitive.unlocked},
        },

        25: {
            title: "Welcome Back!",
            description: "Fundamentality boosts itself.",
            cost: new Decimal("5e16"),
            unlocked() {return hasUpgrade("primitive", 12) || player.arithmetic.unlocked},
            effect() { return player.fundamental.points.add(1).pow(0.15)},
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },

        26: {
            title: "1 Sextillion.",
            description: "x25 Points.",
            cost: new Decimal("1e21"),
            unlocked() {return hasUpgrade("primitive", 12) || player.arithmetic.unlocked},
        },

        27: {
            title: "Wrong Layer",
            description: "x2 Numbers.",
            cost: new Decimal("1e51"),
            unlocked() {return hasUpgrade("primitive", 12) || player.arithmetic.unlocked},
        },

        31: {
            title: "New Row!",
            description: "+10 to Fundamentality softcap numerator and x5 Numbers.",
            cost: new Decimal("1e52"),
            unlocked() {return hasUpgrade("fundamental", 27) || player.arithmetic.unlocked},
        },

        32: {
            title: "Need Help?",
            description: "x25 Numbers and x250 Fundamentality after softcap.",
            cost: new Decimal("1e63"),
            unlocked() {return hasUpgrade("fundamental", 27) || player.arithmetic.unlocked},
        },

        33: {
            title: "That was... Fast...",
            description: "x1e6 to Points.",
            cost: new Decimal("1e69"),
            unlocked() {return hasUpgrade("fundamental", 27) || player.arithmetic.unlocked},
        },

        34: {
            title: "Placeholder Name",
            description: "^1.5 Fundamentality after softcap. Also, x500 Unlock Points.",
            cost: new Decimal("1e72"),
            unlocked() {return hasUpgrade("fundamental", 27) || player.arithmetic.unlocked},
        },

        35: {
            title: "x1e21",
            description: "x1000 Points and x20 Numbers.",
            cost: new Decimal("1e93"),
            unlocked() {return hasUpgrade("fundamental", 27) || player.arithmetic.unlocked},
        },
        
        36: {
            title: "PERIODIC TABLE???",
            description: "+5 to Fundamentality softcap numerator and... x3 Operation Power!",
            cost: new Decimal("1e118"),
            unlocked() {return hasMilestone("primitive", 6)},
        },

        37: {
            title: "The Next Layer V2",
            description: "This is getting slow. x1e10 Unlock Points.",
            cost: new Decimal("1e156"),
            unlocked() {return hasMilestone("primitive", 6)},
        },

        41: {
            title: "Fundamental Exponent",
            effect() {
                let effect = player.fundamental.points
                effect = effect.add(1).pow(0.0002)
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            description: "Oh, hi. Raise Numbers based on Fundamentality.",
            cost: new Decimal("1e321"),
            unlocked() {return hasMilestone("addition", 1)},
        },

        42: {
            title: "Random Number",
            description: "+100 to Subtraction base and x354.82 Numbers.",
            cost: new Decimal("4.82e354"),
            unlocked() {return hasMilestone("addition", 1)},
        },
    },
    buyables: {
        11: {
            cost(x) {
                if (hasUpgrade("primitive", 21)) return new Decimal(600).pow(x).mul("1e30")
                return new Decimal(1000).pow(x).mul("1e30")
            },
            title: "Exponential Increase",
            display() { return "Multiplies Points and Fundamentality by 2 per purchase. " + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = new Decimal(2)
                if (hasMilestone("dimension", 1) && !inChallenge("arithmetic", 13)) base = base.add(3)
                if (hasMilestone("primitive", 8)) {
                    if (hasUpgrade("multiplication", 11)) base = base.add(getBuyableAmount("fundamental", 13).mul(0.5))
                    else base = base.add(getBuyableAmount("fundamental", 13).mul(0.1))
                }
                let effect = base.pow(x)
                if (inChallenge("arithmetic", 13)) effect = effect.pow(0.75)
                if (player.polygon.points.gte(1)) effect = effect.pow(player.polygon.effect)
                return effect
            },
            unlocked() {return hasUpgrade("primitive", 13) || player.arithmetic.unlocked},
        },
        12: {
            cost(x) {
                if (hasUpgrade("subtraction", 11)) return new Decimal("85000").pow(x).mul("1e70")
                return new Decimal("1e5").pow(x).mul("1e70")
            },
            title: "Dynamic Improvement",
            display() { return "Improves \"Progressing\" and \"Mutual Relationship\" per purchase. " + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + new Decimal("10").add(buyableEffect("fundamental", 13)) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: ^" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal(1).add(x.div(10)) },
            unlocked() {return hasUpgrade("primitive", 22) || player.arithmetic.unlocked},
            purchaseLimit() { return new Decimal("10").add(buyableEffect("fundamental", 13)) },
        },
        13: {
            cost(x) {
                return new Decimal("1e15").pow(x).mul("1e150")
            },
            title: "Hardcap Delay",
            display() { return "Adds 1 to the number of max purchases of \"Dynamic Improvement\". " + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + new Decimal("10") + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: +" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal(x) },
            unlocked() {return hasChallenge("arithmetic", 11)},
            purchaseLimit: new Decimal("10"),
        },
    },
    branches: [["primitive", "#FFFFFF", 10]],
})