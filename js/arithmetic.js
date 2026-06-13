addLayer("arithmetic", {
    name: "arithmetic", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ARH", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        softcapExponent: new Decimal(0),
    }},
    color: "#FF0080",
    requires: new Decimal("1e36"), // Can be a function that takes requirement increases into account
    resource: "Operation Power", // Name of prestige currency
    baseResource: "Numbers", // Name of resource prestige is based on
    baseAmount() {return player.primitive.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        if (hasUpgrade("fundamental", 36)) mult = mult.mul(3)
        if (hasUpgrade("subtraction", 13)) mult = mult.mul(100)
        if (hasUpgrade("multiplication", 22)) mult = mult.mul(5)
	    if (hasChallenge("arithmetic", 12)) mult = mult.mul("15")
        if (hasUpgrade("primitive", 26)) mult = mult.mul(100)
        if (hasUpgrade("division", 12)) mult = mult.mul(upgradeEffect("division", 12))
        if (hasUpgrade("arithmetic", 14) && hasUpgrade("multiplication", 51)) mult = mult.mul(upgradeEffect("multiplication", 51))
        //exp
        if (hasChallenge("arithmetic", 13)) mult = mult.pow(1.05)
        //other hypers
        //final effects
        if (hasUpgrade("multiplication", 32)) mult = mult.div(5)
        if (getClickableState("division", 11) == "Active" && hasUpgrade("multiplication", 62)) mult = mult.mul("1e10")
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for Operation Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.arithmetic.unlocked},
    directMult() {
        let dMult = new Decimal(1)
        if (hasUpgrade("polygon", 11)) dMult = dMult.mul(1000)
        dMult = dMult.mul(player.polygon.triEffect)

        if (player.dimension.points.gte(4)) dMult = dMult.pow(1.01)
        return dMult
    },
    softcap() {return new Decimal("1e100")},
    softcapPower() {
        let power = new Decimal(0.25)
        if (player.arithmetic.points.gte("1e100")){power = new Decimal(1).div(player.arithmetic.points.div("1e90").pow(0.1))}
        player.arithmetic.softcapExponent = power
        return power
    },
    effectDescription() {
        let text = ""
        if (player.arithmetic.points.gte("1e100")) text = text + "softcapped by ^" + player.arithmetic.softcapExponent.toFixed(6) + " to its gain."
        else return 
        return text
    },
    passiveGeneration() {if (hasMilestone("polygon", 4)) return 1},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasMilestone("polygon", 3)) keptUpgrades.push(11, 12, 13, 14, 15, 16, 17)
        if (hasMilestone("polygon", 9)) keptUpgrades.push(21, 22, 23, 24, 25, 26, 27)

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        if (hasMilestone("polygon", 8)) keep.push("challenges")

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", "After buying \"Operation Gain,\" manually reset the new layers to gain their benefits."],
                ["display-text", "<sup>No idea why this has to be done, but I guess it's not that bad.</sup>"],
                "upgrades"
            ],
        },
        "Challenges": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "challenges",
            ],
        },
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
        14: {
            title: "Arithmetic Combination",
            effect() {
                let effect = new Decimal(player.addition.points).add(player.subtraction.points).add(1)
                if (player.polygon.points.gte(1)) effect = effect.mul(player.polygon.effect)

                return effect
            },
            description: "Points are multiplied by the sum of your Addition and Subtraction.",
            cost: new Decimal(100),
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        15: {
            title: "Not the Four Basic Operations",
            description: "Points, Addition, and Subtraction are raised to 1.1.",
            cost: new Decimal(250),
        },
        16: {
            title: "Softcaps Suck.",
            description: "+0.1 to Fundamentality softcap exponent and keep Fundamental buyables 1 and 2.",
            cost: new Decimal(15000),
        },
        17: {
            title: "PLEASE NO-",
            description: "Unlock the first Arithmetic Challenge.",
            cost: new Decimal("1e5"),
        },
        21: {
            title: "Insane Math",
            effect() {
                let effect = new Decimal(player.arithmetic.points).pow(1.2).add(1)
                if (hasMilestone("addition", 1)) effect = effect.mul(player.arithmetic.points.pow(0.1).add(1))
                return effect
            },
            description: "Operation Power boosts Points, Addition, and Subtraction.",
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
            cost: new Decimal("1e9"),
            unlocked(){return player.dimension.points.gte(1)},
        },
        22: {
            title: "Even More Challenging",
            description: "Unlock the second Arithmetic Challenge.",
            cost: new Decimal("1e14"),
            unlocked(){return player.dimension.points.gte(1)},
        },
        23: {
            title: "The Final Push",
            description: "Even more simple. x100 Addition, Fundamentality (after softcap), x500 Points, and x1e5 Numbers.",
            cost: new Decimal("2.5e17"),
            unlocked(){return player.dimension.points.gte(1)},
        },
        24: {
            title: "Distributive Property",
            effect() {
                let effect = new Decimal(player.multiplication.points).mul(player.multiplication.points.pow(0.5)).pow(2.5).add(1)
                return effect
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id))},
            description: "Multiplication boosts Addition gain.",
            cost: new Decimal("1e30"),
            unlocked(){return player.dimension.points.gte(3)},
        },
        25: {
            title: "Arithmetic Difficulty Rise",
            description: "Unlock the third Arithmetic Challenge.",
            cost: new Decimal("1e42"),
            unlocked(){return player.dimension.points.gte(3)},
        },
        26: {
            title: "Purely Point-Based",
            description: "^1.05 Points.",
            cost: new Decimal("1e57"),
            unlocked(){return player.dimension.points.gte(3)},
        },
        27: {
            title: "No Longer Useless",
            effect() {
                let effect = player.subtraction.points.pow(0.33).add(1)
                return effect
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id))},
            description: "Subtraction boosts Points.",
            cost: new Decimal("1e80"),
            unlocked(){return player.polygon.unlocked},
        },
    },
    challenges: {
        11: {
            name: "Beginner's Demise",
            challengeDescription: "<i>\"Those who do not know what they are doing will fall.\"</i> Fundamental buyables don't work. ^0.8 to Points and Numbers.",
            goalDescription: "Have 1e130 Fundamentality.",
            rewardDescription: "Unlock a third Fundamentality buyable.",
            canComplete: function() {return player.fundamental.points.gte("1e130")},
            unlocked() {return hasUpgrade("arithmetic", 17) || hasMilestone("polygon", 2)},
        },
        12: {
            name: "UNKNOWN OPERATION",
            challengeDescription: "<i>\"Wait a second. What the hell is Addition?\"</i> Addition boosters do not work. ^0.5 to Points.",
            goalDescription: "Have 1e66 Numbers.",
            rewardDescription: "Unlock Multiplication, x1e15 Points, and x15 Operation Power.",
            canComplete: function() {return player.primitive.points.gte("1e66")},
            unlocked() {return hasUpgrade("arithmetic", 22) || hasMilestone("polygon", 2)},
        },
        13: {
            name: "Dimensionless Reality",
            challengeDescription: "<i>\"The concept of spatial dimensions is nothing but a silly mistake.\"</i> Dimension milestones do not work. ^0.75 to Addition, Subtraction, Points, Fundamentality, Fundamental buyable 1's boost, and Numbers.",
            goalDescription: "Have 1e108 Numbers.",
            rewardDescription: "^1.05 Points, Fundamentality, Numbers, and Operation Points.",
            canComplete: function() {return player.primitive.points.gte("1e108")},
            unlocked() {return hasUpgrade("arithmetic", 25) || hasMilestone("polygon", 2)},
        },
        21: {
            name: "Useless Fundamentals",
            challengeDescription: "<i>\"You must leave the past behind in order to progress.\"</i> Fundamental and Primitive upgrades do not work. Primitive milestones also do not work. ^0.1 Points.",
            goalDescription: "Have 1e120 Points.",
            rewardDescription: "Improve the Addition boosters, and unlock another Addition booster for Number Cores (but this one is heavily nerfed, however, it is NOT affected by Long Division).",
            canComplete: function() {return player.points.gte("1e120")},
            unlocked() {return hasUpgrade("polygon", 14)},
        },
    },
    branches: [["addition", "#FF00FF", 5], ["subtraction", "#FF00FF", 5], ["multiplication", "#FF00FF", 5], ["division", "#FF00FF", 5], ["polygon", "#FFFFFF", 10]],
    tooltip() {return format(player.arithmetic.points) + " Operation Power (+" + format(getResetGain("arithmetic")) + " Operation Power on reset)"},
})