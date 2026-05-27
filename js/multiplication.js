addLayer("multiplication", {
    name: "multiplication", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "×", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
        effect: new Decimal(0),
    }},
    color: "#FF50FF",
    requires() {
        return new Decimal("5e16")
    }, // Can be a function that takes requirement increases into account
    resource: "Multiplication", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.arithmetic.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
        let nerf = new Decimal(0)
        if (hasUpgrade("subtraction", 14)) nerf = nerf.add(1)
        return new Decimal(4).sub(nerf)
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        //exp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasChallenge("arithmetic", 12) || hasMilestone("polygon", 5)},
    directMult() {
        let dMult = new Decimal(1)
        if (hasMilestone("division", 1)) dMult = dMult.mul(2)
        if (hasUpgrade("division", 11)) dMult = dMult.mul(upgradeEffect("division", 11))
        return dMult
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasUpgrade("multiplication", 43)) keptUpgrades.push(43)

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier in Stage 2
        player[this.layer].upgrades.push(...keptUpgrades)
    },
    effect() {
        let final = player.multiplication.total.pow(0.03)
        if (player.polygon.points.gte(1)) final = final.pow(player.polygon.effect)
        player.multiplication.effect = final
    },
    effectDescription() {return "raising Points ^" + player.multiplication.effect.toFixed(6)},
    canBuyMax() {return true},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["infobox", "treeLimit"],
                "blank",
                ["upgrades", [1]],"blank",
                ["upgrades", [2]],"blank",
                ["upgrades", [3]],"blank",
                ["upgrades", [4]],"blank",
                ["upgrades", [5]],"blank",
            ],
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "buyables",
            ],
        },
    },
    infoboxes: {
        treeLimit: {
            title: "The Multiplication Tree",
            body() { return "Yes, I'm more than just a character in the lore. I actually give information! " +
                "Anyway, in The Multiplication Tree, NOT The Modding Tree, you can only have 1 upgrade in each row. " +
                "This persists until you get upgrades in The Multiplication Tree (referred to as TMT in this game) or elsewhere " +
                "that allow for multiple upgrades in a single row. WAIT! If you ever need to respec TMT, " +
                "just Arithmetic reset."
             },
        },
    },
    upgrades: {
        11: {
            title: "Upgrade Tree Trauma",
            description: "You know what? Improve the 8th Primitive milestone.",
            cost: new Decimal(1),
            branches: [[21, "#FFFFFF", 10], [22, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(1)) return false
            },
            pay() {return new Decimal(0)}
        },

        21: {
            title: "Why Multiplication?",
            description: "x1e15 Points and x5 Operation Power.",
            cost: new Decimal(3),
            branches: [[31, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(3)) return false
                if (hasUpgrade("multiplication", 22) && !hasUpgrade("multiplication", 42)) return false
                return hasUpgrade("multiplication", 11)
            },
            pay() {return new Decimal(0)}
        },
        22: {
            title: "A Split Choice",
            effect() {return player.multiplication.total.pow(player.multiplication.total.pow(0.75)).add(1)},
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
            description: "Improve the Point Addition booster by total Multiplication.",
            cost: new Decimal(3),
            branches: [[32, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(3)) return false
                if (hasUpgrade("multiplication", 21) && !hasUpgrade("multiplication", 31)) return false
                return hasUpgrade("multiplication", 11)
            },
            pay() {return new Decimal(0)}
        },

        31: {
            title: "Multi-Upgrade",
            description: "+1 upgrade in the 2nd row, and ^1.2 Fundamentality after softcap.",
            cost: new Decimal(5),
            branches: [[41, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(5)) return false
                if (hasUpgrade("multiplication", 32) && !hasUpgrade("multiplication", 42)) return false
                return hasUpgrade("multiplication", 21)
            },
            pay() {return new Decimal(0)}
        },
        32: {
            title: "Trade-Off",
            description: "/5 Operation Power, but ^1.05 Numbers (after softcap), ^1.1 Addition, and ^1.05 Subtraction.",
            cost: new Decimal(5),
            branches: [[42, "#FFFFFF", 10], [43, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(5)) return false
                if (hasUpgrade("multiplication", 31)) return false
                return hasUpgrade("multiplication", 22)
            },
            pay() {return new Decimal(0)}
        },

        41: {
            title: "Fundamental Help",
            description: "x1e25 Fundamentality after softcap, and raise Fundamental buyable 2's effect to ^1.05.",
            cost: new Decimal(10),
            branches: [[51, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(10)) return false
                if (hasUpgrade("multiplication", 42)) return false
                return hasUpgrade("multiplication", 31)
            },
            pay() {return new Decimal(0)}
        },
        42: {
            title: "Primitive Help",
            description: "x1e10 Numbers after softcap, and unlock more Primitive upgrades. Also, +1 upgrade in the 2nd and 3rd row.",
            cost: new Decimal(10),
            branches: [[51, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(10)) return false
                if (hasUpgrade("multiplication", 41)) return false
                return hasUpgrade("multiplication", 32)
            },
            pay() {return new Decimal(0)}
        },
        43: {
            title: "Division Help",
            description: "x5 Division, and x25 Numbers in Long Division. <i>This upgrade is kept until the next reset layer and doesn't disallow other upgrades in this row. </i>",
            cost: new Decimal(25),
            branches: [[52, "#FFFFFF", 10]],
            canAfford() {
                if (player.multiplication.points.lt(25)) return false
                if (hasUpgrade("multiplication", 41) || hasUpgrade("multiplication", 42)) return false
                return hasUpgrade("multiplication", 32)
            },
            pay() {return new Decimal(0)}
        },

        51: {
            title: "Arithmetic PERMUTATION",
            description: "\"Arithmetic Combination\" is multiplied by Division squared and Multiplication cubed.",
            cost: new Decimal(100),
            canAfford() {
                if (player.multiplication.points.lt(100)) return false
                if (hasUpgrade("multiplication", 52)) return false
                return hasUpgrade("multiplication", 41) && hasUpgrade("multiplication", 42)
            },
            pay() {return new Decimal(0)}
        },
        52: {
            title: "Primitive Progression",
            effect() {
                let base = player.multiplication.points
                base = base.pow(0.02)
                if (base.eq(0)) return new Decimal(1)
                return base
            },
            effectDisplay() {return "^" + format(upgradeEffect("multiplication", 52))},
            description: "Multiplication boosts \"Primitive Boost.\"",
            cost: new Decimal(150),
            canAfford() {
                if (player.multiplication.points.lt(150)) return false
                if (hasUpgrade("multiplication", 51)) return false
                return hasUpgrade("multiplication", 43)
            },
            pay() {return new Decimal(0)}
        },
    },
    buyables: {
        11: {
            cost(x) {
                let base = new Decimal(2).pow(x)
                return base
            },
            title: "Actual Multiplying Boost",
            display() { return "Multiplies Points and Addition by 5 per purchase. (Require: only needs x, does not subtract / Cost: does subtract currency)" + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Require: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = new Decimal(5)
                let effect = base.pow(x)
                return effect
            },
            unlocked() {return hasMilestone("polygon", 6)},
        },
    },
    tooltip() {
        let able = canReset("multiplication")
        if (!able) return format(player.multiplication.points) + " Multiplication (Unable to reset)"
        return format(player.multiplication.points) + " Multiplication (+" + format(getResetGain("multiplication")) + " Multiplication on reset)"
    },
})