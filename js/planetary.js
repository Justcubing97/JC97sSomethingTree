addLayer("planetary", {
    name: "planetary", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PLF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),

        mercuryGenAmt: new Decimal(0),
        venusGenAmt: new Decimal(0),
        earthGenAmt: new Decimal(0),
        marsGenAmt: new Decimal(0),
        jupiterGenAmt: new Decimal(0),
        saturnGenAmt: new Decimal(0),
        uranusGenAmt: new Decimal(0),
        neptuneGenAmt: new Decimal(0),
        planetPower: new Decimal(0),
        planetPowerEffect: new Decimal(0),
        pPps: new Decimal(0),
        pPA: true
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
        if (hasAchievement("planetary", 11)) mult = mult.mul(3)
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
        player.planetary.pPA = true
        setClickableState(this.layer, this.id, player.planetary.pPA)

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes" }],
                ["display-text", function() { return "You have " + format(player.planetary.total) + " total Planetary Fragments" }],
                "blank",
                ["display-text", function() { return "<b>Planetary reset will fully reset EVERYTHING!</b>" }],
                "blank",
                ["display-text", function() { return "<sup>Certain achievements will also be reset.</sup>" }],
                "blank",
                "milestones",
                "blank",
                "upgrades",
            ],
        },
        "Generators": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes" }],
                ["display-text", function() { return "You have " + format(player.planetary.total) + " total Planetary Fragments" }],
                "blank",
                ["display-text", function() { return "<h2>You have " + format(player.planetary.planetPower) + " Planet Power, multiplying Points by x" + format(player.planetary.planetPowerEffect)}],
                ["display-text", function() { return "<h3>You are gaining " + format(player.planetary.pPps) + " Planet Power per second."}],
                "blank",
                ["clickable", 12],
                "blank",
                "buyables",
            ],
        },
        "Planetary Challenges": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes" }],
                ["display-text", function() { return "You have " + format(player.planetary.total) + " total Planetary Fragments" }],
                "blank",
                ["infobox", "planChalBox"],
                "blank",
                ["clickable", 11],
                "blank",
                "achievements",
            ],
            unlocked() {return hasMilestone("planetary", 6)},
        },
    },

    clickables: {
        11: {
            title: "Force Planetary reset",
            display: "This will force a Planetary reset with no currency gain.",
            canClick() {return true},
            onClick() {
                doReset("planetary", true)
            },
            style() {
                return {
                    "width": "150px",
                }
            }
        },
        12: {
            title: "Planet Power Effect",
            display() {
                let text = "This will force a Planetary reset with no currency gain, and change Planet Power's effect from multiplying to dividing. Currently: "
                if (getClickableState(this.layer, this.id)) text += "Planet Power's effect is multiplying."
                else text += "Planet Power's effect is dividing at a reduced rate."
                return text
            },
            canClick() {return true},
            onClick() {
                player.planetary.pPA = !player.planetary.pPA
                setClickableState(this.layer, this.id, player.planetary.pPA)
                doReset("planetary", true)
            },
            style() {
                return {
                    "width": "150px",
                }
            },
            unlocked() {return hasMilestone("planetary", 6)}
        },
    },

    upgrades: {
        11: {
            title: "Polygonal Care",
            effect() {
                let base = player.planetary.points
                let effect = base.add(1).pow(0.9).mul("1e25")
                return effect
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id))},
            description: "Planetary Fragments delay the Shape hardcap.",
            cost: new Decimal("10"),
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 1 total Planetary Fragment",
            effectDescription: "Keep generation for Fundamentality, Numbers, and Operation Power. /100 all Constructor polygon construction times. x100 Shapes. Raise the Point Addition booster hardcap to 1e2500. ^1.5 Operation Power.",
            done() { return player.planetary.total.gte(1) },
            unlocked () {return true},
        },
        2: {
            requirementDescription: "2: 2 total Planetary Fragments",
            effectDescription: "Square Point gain, x1e10 Division, x100 Multiplication, and autobuy Fundamental and Number Core buyables.",
            done() { return player.planetary.total.gte(2) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
        },
        3: {
            requirementDescription: "3: 3 total Planetary Fragments",
            effectDescription: "Keep all Arithmetic upgrades and uncap \"Mutual Relationship\".",
            done() { return player.planetary.total.gte(3) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
        },
        4: {
            requirementDescription: "4: 5 total Planetary Fragments",
            effectDescription: "Keep all Fundamental and Primitive upgrades up to this point. Start with the first three Multiplication hardcaps removed.",
            done() { return player.planetary.total.gte(5) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
        },
        5: {
            requirementDescription: "5: 15 total Planetary Fragments",
            effectDescription: "Automate the Multiplication buyable and unlock another one. Keep the Fundamentality buyables.",
            done() { return player.planetary.total.gte(15) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
        },
        6: {
            requirementDescription: "6: 50 total Planetary Fragments",
            effectDescription: "Unlock Planetary Challenges, and keep the Constructor unlocked.",
            done() { return player.planetary.total.gte(50) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
        },
    },

    buyables: {
        11: {
            cost(x) {
                let base = new Decimal(1.5).pow(x)
                return base
            },
            title: "Mercury Generator",
            display() {
                let text = "Generates Planet Power based on its amount." + "\n" + "Amount: " + player.planetary.mercuryGenAmt + " (" + getBuyableAmount(this.layer, this.id) + ")" + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: "
                if (getBuyableAmount("planetary", 11).eq(0)) text += "Buy a generator to start generating!"
                else text += "+" + format(this.effect()) + " Planet Power/s"
                return text
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.planetary.mercuryGenAmt = player.planetary.mercuryGenAmt.add(1)
            },
            effect(x) {
                let base = new Decimal(1.1)
                let effect = base.pow(player.planetary.mercuryGenAmt)
                effect = effect.div(1.1)
                return effect
            },
            unlocked() {return true},
        },
        12: {
            cost(x) {
                let base = new Decimal(2).pow(x).mul("50")
                return base
            },
            title: "Venus Generator (NO EFFECT)",
            display() {
                let text = "Generates Mercury Generators based on its amount." + "\n" + "Amount: " + player.planetary.venusGenAmt + " (" + getBuyableAmount(this.layer, this.id) + ")" + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: "
                if (getBuyableAmount(this.layer, this.id).eq(0)) text += "Buy a generator to start generating!"
                else text += "+" + format(this.effect()) + " Planet Power/s"
                return text
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.planetary.venusGenAmt = player.planetary.venusGenAmt.add(1)
            },
            effect(x) {
                let base = new Decimal(1.2)
                let effect = base.pow(player.planetary.venusGenAmt)
                effect = effect.div(1.2)
                return effect
            },
            unlocked() {return getBuyableAmount("planetary", 11).gte(1)},
        },
    },

    infoboxes: {
        planChalBox: {
            title: "Planetary Challenges",
            body() { return "Welcome to another instance of me appearing in a place that's not the Unlock layer. " +
                "Anyway, Planetary Challenges are NOT your standard The Modding Tree challenges. Instead, they're achievements! " +
                "To complete them, you need to Planetary reset. Simple? NO. Each challenge restricts your pre-planetary progress in some way, " +
                "unique for each challenge. For the first one, \"No need to sacrifice,\" as an example, you need " +
                "to Planetary reset without sacrificing your constructor. The tooltip that appears on hover will " +
                "explain the challenge's condition in more detail. The reward will appear in the tooltip after its " +
                "completed. I went ahead and added a force reset button in this tab for convenience. "
            },
        },
    },

    achievements: {
        11: {
            name: "<h1>1: No need to sacrifice.<br>",
            done(){return getResetGain("planetary").gte("1") && challengeCompletions("polygon", 11) == 0},
            goalTooltip() {return "Planetary reset without sacrificing the Constructor, not even 10%."},
            doneTooltip() {return "This Planetary Challenge is completed. x3 Planetary Fragments."},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        12: {
            name: "<h1>2: Deadly Generators<br>",
            done(){return getResetGain("planetary").gte("1") && false},
            goalTooltip() {return "PH"},
            doneTooltip() {return "PH"},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        13: {
            name: "<h1>3: Boostless Core<br>",
            done(){return getResetGain("planetary").gte("1") && false},
            goalTooltip() {return "PH"},
            doneTooltip() {return "PH"},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        14: {
            name: "<h1>4: Only Multiplication<br>",
            done(){return getResetGain("planetary").gte("1") && false},
            goalTooltip() {return "PH"},
            doneTooltip() {return "PH"},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        21: {
            name: "<h1>5: Number Core Defect Overflow<br>",
            done(){return getResetGain("planetary").gte("1") && false},
            goalTooltip() {return "PH"},
            doneTooltip() {return "PH"},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        22: {
            name: "<h1>6: Hole-in-one<br>",
            done(){return getResetGain("planetary").gte("1") && player.polygon.resets.eq("1")},
            goalTooltip() {return "Planetary reset with only 1 Polygonification."},
            doneTooltip() {return "This Planetary Challenge is completed. x1e25 to the Shape softcap."},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        23: {
            name: "<h1>7: Shapeless Realm<br>",
            done(){return getResetGain("planetary").gte("1") && false},
            goalTooltip() {return "PH"},
            doneTooltip() {return "PH"},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
        24: {
            name: "<h1>8: Arithmetic Challenge 3 V2<br>",
            done(){return getResetGain("planetary").gte("1") && false},
            goalTooltip() {return "PH"},
            doneTooltip() {return "PH"},
            unlocked() {return true},
            style() {return {
                "width": "200px",
                "height": "150px",
                "align-content": "center"
            }}
        },
    },

    update(diff){
        let mult = new Decimal(0)
        if (getBuyableAmount("planetary", 11).gte(1)) mult = mult.add(buyableEffect("planetary", 11)).mul(getBuyableAmount("planetary", 11))

        player.planetary.pPps = mult

        //FINAL!!!
        player.planetary.planetPower = player.planetary.planetPower.add(mult.mul(diff))
        player.planetary.planetPowerEffect = player.planetary.planetPower.add(1).pow(player.planetary.planetPower.add(1).log(2).mul(player.planetary.planetPower.add(1).log(1.5)))
    },

    glowColor() {
        let layer = "planetary"
        for (id in tmp[layer].upgrades){
            if (isPlainObject(layers[layer].upgrades[id])){
                if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
                    return "red"
                }
            }
        }

        for (const id of [11, 12]) {
            if (canBuyBuyable(layer, id)) {
                return "cyan"
            }
        }

        return ""
    },
    shouldNotify() {
        let layer = "planetary"
        for (const id of [11, 12]) {
            if (canBuyBuyable("planetary", id)) {
                return true
            }
        }
        return false
    },
    
    tooltip() {return format(player.planetary.points) + " Planetary Fragments (+" + format(getResetGain("planetary")) + " Planetary Fragments on reset)"},
})