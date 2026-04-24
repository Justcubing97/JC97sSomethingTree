addLayer("fundamental", {
    name: "fundamental", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FND", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
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
        //mul
        if (hasUpgrade("fundamental", 11)) mult = mult.mul(2)
        if (hasUpgrade("fundamental", 14)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 21)) mult = mult.mul(upgradeEffect("fundamental", 21))
        if (hasUpgrade("primitive", 11)) mult = mult.mul(5)
        if (hasUpgrade("fundamental", 25)) mult = mult.mul(upgradeEffect("fundamental", 25))
        if (hasMilestone("primitive", 2)) mult = mult.mul(100)
        if (getBuyableAmount("fundamental", 11).gte(1)) mult = mult.mul(buyableEffect("fundamental", 11))
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for Fundamentality", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.fundamental.unlocked},
    passiveGeneration() {if (hasUpgrade("fundamental", 23)) return 1},
    softcap() {return new Decimal("1e50")},
    softcapPower() {
        let numerator = new Decimal(1000);
        if (hasUpgrade("fundamental", 31)) numerator = new Decimal("1e6");
        let power = numerator.div(player.fundamental.points.div("1e46").add(1))
        return power
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasMilestone("primitive", 2)) keptUpgrades.push(23)
        if (hasUpgrade("primitive", 15)) {
            keptUpgrades.push(11)
            keptUpgrades.push(12)
            keptUpgrades.push(13)
            keptUpgrades.push(14)
            keptUpgrades.push(15)
            keptUpgrades.push(16)
            keptUpgrades.push(17)
            keptUpgrades.push(21)
            keptUpgrades.push(22)
            keptUpgrades.push(23)
            keptUpgrades.push(24)
            keptUpgrades.push(25)
            keptUpgrades.push(26)
            keptUpgrades.push(27)
        }

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];
        //if (someOtherCondition) keep.push("milestones");

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
                "upgrades"
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
                if (hasUpgrade("fundamental", 22)) {return player[this.layer].points.add(1).pow(0.75)} else {return player[this.layer].points.add(1).pow(0.33)}
            },
            effectDisplay() { return "Currently: x" + format(upgradeEffect(this.layer, this.id)) },
        },

        21: {
            title: "Mutual Relationship",
            description: "Points boosts Fundamentality.",
            cost: new Decimal(25000),
            unlocked() {return hasUpgrade("fundamental", 17) || player.primitive.unlocked},
            effect() { return player.points.add(1).pow(0.25)},
            effectDisplay() { return "Currently: x" + format(upgradeEffect(this.layer, this.id)) },
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
            unlocked() {return hasUpgrade("primitive", 12)},
            effect() { return player.fundamental.points.add(1).pow(0.15)},
            effectDisplay() { return "Currently: x" + format(upgradeEffect(this.layer, this.id)) },
        },

        26: {
            title: "1 Sextillion.",
            description: "x25 Points.",
            cost: new Decimal("1e21"),
            unlocked() {return hasUpgrade("primitive", 12)},
        },

        27: {
            title: "Wrong Layer",
            description: "x2 Numbers.",
            cost: new Decimal("1e51"),
            unlocked() {return hasUpgrade("primitive", 12)},
        },

        31: {
            title: "New Row!",
            description: "x1000 to Fundamentality softcap numerator and x5 Numbers.",
            cost: new Decimal("1e52"),
            unlocked() {return hasUpgrade("fundamental", 27)},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1000).pow(x).mul("1e30") },
            title: "Exponential Increase",
            display() { return "Multiplies Points and Fundamentality by 2 per purchase. " + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: " + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal(2).pow(x) },
            unlocked() {return hasUpgrade("primitive", 13)},
        },
    }
})

//eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc3NjkwNzk2MjQwOCwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJKdXN0Y3ViaW5nOTcncy1Tb21ldGhpbmctVHJlZS1KdXN0Y3ViaW5nOTciLCJ2ZXJzaW9uIjoiMC4xIiwidGltZVBsYXllZCI6NTc3Ny43NDI5OTk5OTk2ODYsImtlZXBHb2luZyI6ZmFsc2UsImhhc05hTiI6ZmFsc2UsInBvaW50cyI6IjEuODQ5NDQwOTQyMTM5MzUzNGUyNiIsInN1YnRhYnMiOnsiY2hhbmdlbG9nLXRhYiI6e30sInVubG9jayI6eyJtYWluVGFicyI6Ik1haW4ifSwiZnVuZGFtZW50YWwiOnsibWFpblRhYnMiOiJCdXlhYmxlcyJ9fSwibGFzdFNhZmVUYWIiOiJmdW5kYW1lbnRhbCIsImluZm9ib3hlcyI6eyJ1bmxvY2siOnsiZDEiOmZhbHNlLCJkMiI6ZmFsc2V9fSwiaW5mby10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo1Nzc3Ljc0Mjk5OTk5OTY4NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJvcHRpb25zLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjU3NzcuNzQyOTk5OTk5Njg2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImNoYW5nZWxvZy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo1Nzc3Ljc0Mjk5OTk5OTY4NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJ1bmxvY2siOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjQzNzQiLCJ0b3RhbCI6IjEwNDM3NSIsImJlc3QiOiIxMDQzNzQiLCJyZXNldFRpbWUiOjU3NzcuNzQyOTk5OTk5Njg2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOlsxMSwxMl0sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiYSI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo1Nzc3Ljc0Mjk5OTk5OTY4NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6WyIxMSIsIjEyIiwiMTMiXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImZ1bmRhbWVudGFsIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIyLjQ1MzA1OTQ0NjYyMTgxMWUyNSIsInRvdGFsIjoiMi40NTMxNTk0NTE2MjE4NDllMjUiLCJiZXN0IjoiMi40NTMwNTk0NDY2MjE4MTFlMjUiLCJyZXNldFRpbWUiOjUyLjg0NTk5OTk5OTk5OTU1LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6eyIxMSI6IjAifSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6WzIzLDExLDIxLDEyLDEzLDE0LDE1LDE2LDE3LDIyLDI0LDI1LDI2XSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiIsImFjdGl2ZUNoYWxsZW5nZSI6bnVsbH0sInByaW1pdGl2ZSI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMTgwNzgxMSIsInRvdGFsIjoiMTgyNzg1MiIsImJlc3QiOiIxODA3ODExIiwicmVzZXRUaW1lIjo1Mi44NDU5OTk5OTk5OTk1NSwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbMTEsMTIsMTNdLCJtaWxlc3RvbmVzIjpbIjEiLCIyIl0sImxhc3RNaWxlc3RvbmUiOiIyIiwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImJsYW5rIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6NTc3Ny43NDI5OTk5OTk2ODYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwidHJlZS10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo1Nzc3Ljc0Mjk5OTk5OTY4NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9fQ==