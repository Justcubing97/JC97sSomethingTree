addLayer("polygon", {
    name: "polygon", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PLY", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resets: new Decimal(0),
        effect: new Decimal(0),
        constrBaseTime: new Decimal(30),
        constrCurrentTime: new Decimal(30),

        triangles: new Decimal(0),
        squares: new Decimal(0),
        pentagons: new Decimal(0),
        hexagons: new Decimal(0),
        triEffect: new Decimal(1),
        squEffect: new Decimal(1),
        penEffect: new Decimal(1),
        hexEffect: new Decimal(1),

        constrNextGain: new Decimal(1),
    }},
    color: "#2050FF",
    requires: new Decimal("1e80"), // Can be a function that takes requirement increases into account
    resource: "Shapes", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.arithmetic.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0333, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        if (hasMilestone("division", 2)) mult = mult.mul(10)
        if (hasUpgrade("polygon", 13)) mult = mult.mul(upgradeEffect("polygon", 13))
        if (player.dimension.points.gte(4)) mult = mult.mul(4)
        //exp
        //other hypers
        //final effects
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Shapes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.polygon.unlocked},
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    resetDescription: "Polygonify for ",
    onPrestige() {player.polygon.resets = player.polygon.resets.add(1)},
    effect() {
        let base = player.polygon.points.add(1).pow(3.33)
        player.polygon.effect = base
    },
    effectDescription() {
        return "multiplying Fundamental buyable 1's effect, Multiplication's effect, and \"Arithmetic Combination\" by x" + format(player.polygon.effect)
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
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.arithmetic.points) + " Operation Power" }],
                ["display-text", function() { return "You have Polygonified " + format(player.polygon.resets) + " time(s)" }],
                "blank",
                "milestones",
                "blank",
                "upgrades",
            ],
        },
        "Constructor": {
            unlocked() {return hasMilestone("division", 3)},
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.arithmetic.points) + " Operation Power" }],
                ["display-text", function() { return "You have Polygonified " + format(player.polygon.resets) + " time(s)" }],
                "blank",
                ["display-text", function() { return "<b>Unlocking the Constructor unlocks a 4th buyable for Number Cores, gives +1 upgrade in the 5th row of TMT, and unlocks the 6th row of TMT. Also, x5 Division." }],
                "blank",
                ["display-text", function() { return "<sup>Note: \"Polygons\" will refer to the Constructor's shapes, \"Shapes\" will refer to the main currency, \"Polygon Layer\" will refer to the layer as a whole." }],
                "blank",
                ["bar", "level"],
                "blank",
                ["clickable", 11],
                "blank",
                ["display-text", function() {
                    let text = "You have constructed <b>" + format(player.polygon.triangles) + " Triangles</b>, multiplying Operation power (after softcap) by x" + player.polygon.triEffect.toFixed(6)
                    if (hasMilestone("division", 4)) text += ", Squares by x" + format(player.polygon.triEffect.add(1).pow("0.5")) + ", Points by x" + format(player.polygon.triEffect.add(1).pow("100"))
                    return text
                }],
                ["display-text", function() { return "You have constructed <b>" + format(player.polygon.squares) + " Squares</b>, multiplying Number Cores by x" + player.polygon.squEffect.toFixed(6) }],
                ["display-text", function() { return "You have constructed <b>" + format(player.polygon.pentagons) + " Pentagons</b>, raising Addition and Subtraction to ^" + player.polygon.penEffect.toFixed(6) }],
                ["display-text", function() { return "You have constructed <b>" + format(player.polygon.hexagons) + " Hexagons</b>, raising Points, Fundamentality (after softcap), and Numbers (after softcap) to ^" + player.polygon.hexEffect.toFixed(6) }],
                "blank",
                ["buyables", [1]],
            ],
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 Polygonification",
            effectDescription: "Keep all Primitive milestones completed.",
            done() { return player.polygon.resets.gte("1") },
            unlocked() {return true},
        },
        2: {
            requirementDescription: "2 Polygonifications",
            effectDescription: "Keep all Arithmetic Challenges unlocked.",
            done() { return player.polygon.resets.gte("2") },
            unlocked() {return true},
        },
        3: {
            requirementDescription: "3 Polygonifications",
            effectDescription: "Keep Fundamental upgrades 1-23, Primitive upgrades 1-12, and Arithmetic upgrades 1-7.",
            done() { return player.polygon.resets.gte("3") },
            unlocked() {return true},
        },
        4: {
            requirementDescription: "4 Polygonifications",
            effectDescription: "The Addition booster for Fundamentality is always active. Passively generate 100% of pending Operation Power per second.",
            done() { return player.polygon.resets.gte("4") },
            unlocked() {return true},
        },
        5: {
            requirementDescription: "5 Polygonifications",
            effectDescription: "Unlock Division and keep Multiplication unlocked.",
            done() { return player.polygon.resets.gte("5") },
            unlocked() {return true},
        },
        6: {
            requirementDescription: "7 Polygonifications",
            effectDescription: "Unlock a Multiplication buyable and another Fundamental buyable. +50 to the max of Fundamental buyable 1.",
            done() { return player.polygon.resets.gte("7") },
            unlocked() {return true},
        },
        7: {
            requirementDescription: "10 Polygonifications",
            effectDescription: "x1e10 Points in Long Division.",
            done() { return player.polygon.resets.gte("10") },
            unlocked() {return true},
        },
        8: {
            requirementDescription: "25 Polygonifications",
            effectDescription: "x3.5 Division, and keep the first three Arithmetic Challenges completed.",
            done() { return player.polygon.resets.gte("25") },
            unlocked() {return true},
        },
        9: {
            requirementDescription: "50 Polygonifications",
            effectDescription: "KEEPIN' EVERYTHING! Keep the 4th Fundamental buyable, Primitive upgrades 13-14, the second row of Arithmetic upgrades, and Multiplication on Polygonification.",
            done() { return player.polygon.resets.gte("50") },
            unlocked() {return true},
        },
    },
    upgrades: {
        11: {
            title: "Powerful Boosts",
            description: "x1000 Operation Power and ^1.5 Fundamentality, both after softcap.",
            cost: new Decimal(50),
        },
        12: {
            title: "Not Much to do Here...",
            effect(){
                let base = player.polygon.points
                base = base.pow(0.1)
                if (base.eq(0)) base = new Decimal(1)
                base = base.sub(0.8)
                return base
            },
            effectDisplay(){
                return "+" + format(upgradeEffect(this.layer, this.id)) + " to milestone's base effect."
            },
            description: "Shapes boost the 8th Primitive Milestone. And x1e40 Unlock Points.",
            cost: new Decimal(250),
        },
        13: {
            effect(){
                let base = player.subtraction.points
                base = base.pow(0.001)
                if (base.eq(0)) base = new Decimal(1)
                return base
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
            title: "QOL Time!",
            description: "Keep the first three rows of TMT, and the Addition booster for Numbers is always active. Also, Subtraction boosts Shapes.",
            cost: new Decimal(500),
        },
        14: {
            title: "Another Challenge?",
            description: "Unlock a 4th Arithmetic Challenge.",
            cost: new Decimal("2000"),
        },
        15: {
            effect(){
                let base = getBuyableAmount("multiplication", 11)
                base = base.add(1).pow(1.5).pow(base.add(1).log(4))
                return base
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
            title: "This isn't even Polygon-related.",
            description: "The amount of the first Multiplication buyable boosts Number Cores, and keep its amount.",
            cost: new Decimal("50000"),
        },
    },
    bars: {
        level: {
            direction: RIGHT,
            width: 400,
            height: 75,
            display() {
                let chosen = getClickableState("polygon", 11) || "triangle"
                let text = "Your next " + format(player.polygon.constrNextGain) + " " + chosen + "s will be constructed in " + format(player.polygon.constrCurrentTime) + "/" + format(player.polygon.constrBaseTime) + " seconds."
                
                return text
            },
            progress() {
                let prog = 0
                prog = 1 - (player.polygon.constrCurrentTime.div(player.polygon.constrBaseTime))
                return prog
            },
            baseStyle() { return {"background-color": "#082070",} },
            fillStyle() { return {"background-color": "#2050FF",} },
        },
    },
    clickables: {
        11: {
            title: "Switch Focus",
            display() {
                return "Switching construction focus will reset the construction timer. <b>Currently: " + getClickableState("polygon", 11)
            },
            canClick() {return true},
            onClick() {
                if (getClickableState("polygon", 11) == "Pentagon") {setClickableState("polygon", 11, "Hexagon"); player.polygon.constrBaseTime = new Decimal(10800).mul(buyableEffect("polygon", 11))}
                else if (getClickableState("polygon", 11) == "Square") {setClickableState("polygon", 11, "Pentagon"); player.polygon.constrBaseTime = new Decimal(3600).mul(buyableEffect("polygon", 11))}
                else if (getClickableState("polygon", 11) == "Triangle") {setClickableState("polygon", 11, "Square"); player.polygon.constrBaseTime = new Decimal(300).mul(buyableEffect("polygon", 11))}
                else {setClickableState("polygon", 11, "Triangle"); player.polygon.constrBaseTime = new Decimal(30).mul(buyableEffect("polygon", 11))}
                player.polygon.constrCurrentTime = player.polygon.constrBaseTime
            },
        },
    },
    buyables: {
        11: {
            cost(x) {
                let base = new Decimal("1500")
                let scale = new Decimal("1.1").add(x.div("10"))
                return scale.pow(x).mul(base)
            },
            title: "Upgrade Compass",
            display() { return "Upgrade your compass so you can draw shapes faster! The effects will occur upon switching construction focus." + "\n" + "Compass level: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Time multiplier (of all shapes): x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let effect = new Decimal("0.95").pow(x)
                if (player.dimension.points.gte(4)) effect.div(1.2)
                return effect
            },
        },
        12: {
            cost(x) {
                let base = new Decimal("1500")
                let scale = new Decimal("1.125").add(x.div("8"))
                return scale.pow(x).mul(base)
            },
            title: "Upgrade Straightedge",
            display() { return "Upgrade your straightedge so you can draw more shapes at a time!" + "\n" + "Straightedge level: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Shape multiplier: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal("1.25").pow(x) },
        },
    },

    update(diff){
        let effect = new Decimal(1)

        effect = effect.mul(buyableEffect("polygon", 12))

        let triBase = effect
                
        let squBase = effect
        if (hasMilestone("division", 4)) squBase = squBase.mul(player.polygon.triEffect.add(1).pow("0.5"))

        let penBase = effect

        let hexBase = effect

        if (getClickableState("polygon", 11) == "Triangle") player.polygon.constrNextGain = triBase
        else if (getClickableState("polygon", 11) == "Square") player.polygon.constrNextGain = squBase
        else if (getClickableState("polygon", 11) == "Pentagon") player.polygon.constrNextGain = penBase
        else if (getClickableState("polygon", 11) == "Hexagon") player.polygon.constrNextGain = hexBase

        if (hasMilestone("division", 3)){
            player.polygon.constrCurrentTime = player.polygon.constrCurrentTime.sub(diff)
            if (player.polygon.constrCurrentTime.lte(0)) {
                player.polygon.constrCurrentTime = player.polygon.constrBaseTime

                if (getClickableState("polygon", 11) == "Triangle") player.polygon.triangles = player.polygon.triangles.add(triBase)
                else if (getClickableState("polygon", 11) == "Square") player.polygon.squares = player.polygon.squares.add(squBase)
                else if (getClickableState("polygon", 11) == "Pentagon") player.polygon.pentagons = player.polygon.pentagons.add(penBase)
                else if (getClickableState("polygon", 11) == "Hexagon") player.polygon.hexagons = player.polygon.hexagons.add(hexBase)
            }
        }
        player.polygon.triEffect = player.polygon.triangles.pow(0.5).add(1)
        player.polygon.squEffect = player.polygon.squares.pow(0.8).add(1)
        player.polygon.penEffect = player.polygon.pentagons.pow(0.01).add(1)
        player.polygon.hexEffect = player.polygon.hexagons.add(1).log(10).div(100).add(1)
    },

    tooltip() {return format(player.polygon.points) + " Shapes (+" + format(getResetGain("polygon")) + " Shapes on reset)"},
})