addLayer("multiplication", {
    name: "multiplication", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "×", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FF50FF",
    requires() {
        return new Decimal("1e17")
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
    layerShown(){return hasChallenge("arithmetic", 12)},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
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
    effect() {return player.multiplication.total.pow(0.03)},
    effectDescription() {return "raising Points ^" + format(player.multiplication.total.pow(0.03))},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["infobox", "treeLimit"],
                "blank",
                ["upgrades", [1]],"blank",
                ["upgrades", [2, 3]],"blank",
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
                "Anyway, in The Multiplication Tree, NOT The Modding Tree, you can only have 1 upgrade in each row." +
                "This persists until you get upgrades in The Multiplication Tree (referred to as TMT in this game) " +
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
            pay() {return new Decimal(0)}
        },

        21: {
            title: "Why Multiplication?",
            description: "x1e15 Points and x5 Operation Power.",
            cost: new Decimal(3),
            canAfford() {
                if (hasUpgrade("multiplication", 22)) {return false}
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
            canAfford() {
                if (hasUpgrade("multiplication", 21)) {return false}
                return hasUpgrade("multiplication", 11)
            },
            pay() {return new Decimal(0)}
        },
    },
})