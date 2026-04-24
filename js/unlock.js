addLayer("unlock", {
    name: "unlock", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "UNL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#8000FF",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Unlock Points", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        if (hasUpgrade("fundamental", 24)) mult = mult.mul(100)
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "u", description: "U: Reset for Unlock Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Unlock the Fundamental layer",
            description: "Unlock the Fundamental layer: the beginning of JC97's Something Tree.",
            cost: new Decimal(1),
            onPurchase() {return player.fundamental.unlocked = true},
        },

        12: {
            title: "Unlock the Primitive layer",
            description: "Unlock the Primitive layer: the first reset layer.",
            cost: new Decimal("1e5"),
            onPurchase() {return player.primitive.unlocked = true},
        },
    },
    branches: ["fundamental"],
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "upgrades"
            ],
        },
        "Lore (Chapter 1)": {
            content: [
                ["infobox", "d1"],
                ["infobox", "d2"],
                ["infobox", "d3"],
            ],
        },
    },
    infoboxes: {
        d1: {
            title: "Document 1: The Beginning",
            body() { return "Well... this is awkward. Hello, player, I guess. You may not know who I am. " +
                "I'm Justcubing97, some random person stuck in The Void. I also made this game. " +
                "Welcome to JC97's Something Tree, or JST. My room isn't very interesting nor large, " +
                "about as spacious as a normal kitchen, albeit with all the human necessities crammed into this space. " +
                "It's getting late; I probably should rest. See you in the morning, player." },
        },
        d2: {
            title: "Document 2: The Morning",
            body() { return "It's been a great 8 hours since I've seen you. If you're reading this, you actually sort of play JST! " +
                "Because to read this message, you need to have \"The Second REAL Upgrade\" purchased. " +
                "Anyway, let me tell you more about The Void. It's basically a giant triangle plane, where the centroid is at the... " +
                "well... centroid of the giant triangle. It's the command center of The Void. Hold on, " +
                "they're coming to let me out for morning activities. See you in a bit. Or 2,147,483,647 bits." },
            unlocked() {return hasUpgrade("fundamental", 12) || player.primitive.unlocked},
        },
        d3: {
            title: "Document 3: Normalcy",
            body() { return "Alright, I'm back from my morning activities. They're nothing special, it's just like... " +
                "getting ready for the day, taking a shower, eating breakfast, which is, by the way, kinda amazing. " +
                "Like, when does bacon and eggs taste THIS GOOD? Anyway, you must like playing JST, because to read this, " +
                "you need to have 1e14 Numbers. Not that I haven't made astronomically larger numbers, because of another thing " +
                "called JOS, or Justcubing97's Omeganization System. It's a number system that's intended to be super easy to understand. " +
                "Alright... I guess it's time to spend all my time in my room, reading some dumb AP textbooks in the super convenient " + 
                "bookshelf in the corner. See you in a bit. Or... [O]{10 & 100} bits. (Yes, that was from JOS.)"
             },
            unlocked() {return hasMilestone("primitive", 3)}
        },
    },
    resetsNothing: true,
});