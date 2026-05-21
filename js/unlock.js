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
        if (hasUpgrade("fundamental", 34)) mult = mult.mul(500)
        if (hasUpgrade("fundamental", 37)) mult = mult.mul(1e10)
        //exp in gainExp
        //other hypers
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "u", description: "U: Reset for Unlock Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Fundamental layer",
            description: "Unlock the Fundamental layer: the beginning of JC97's Something Tree.",
            cost: new Decimal(1),
            onPurchase() {return player.fundamental.unlocked = true},
        },

        12: {
            title: "Primitive layer",
            description: "Unlock the Primitive layer: the first reset layer.",
            cost: new Decimal("1e5"),
            onPurchase() {return player.primitive.unlocked = true},
        },

        13: {
            title: "Arithmetic layer",
            description: "Unlock the Arithmetic layer: the second reset layer.",
            cost: new Decimal("1e20"),
            onPurchase() {return player.arithmetic.unlocked = true},
        },

        14: {
            title: "Dimension layer",
            description: "Unlock the Dimension layer: a sub-reset layer.",
            cost: new Decimal("1e50"),
            onPurchase() {return player.dimension.unlocked = true},
        },
    },
    branches: [["fundamental", "#FFC800", 10], ["primitive", "#00C8FF", 10], ["arithmetic", "#FF0080", 10], ["dimension", "#A0FFA0", 10]],
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
                ["infobox", "d4"],
                ["infobox", "d5"],
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
            unlocked() {return hasMilestone("primitive", 3) || player.arithmetic.unlocked}
        },
        d4: {
            title: "Document 4: AP World History",
            body() { return "Now I'm not a fan of AP World History. But, learn something instead of nothing, right? " +
                "Reading this requires having the Arithmetic layer unlocked. So if you're reading this, good job! " +
                "You did what most players couldn't do and reached the \"pink level\" in those annoying mobile game ads. " +
                "Moving onto AP World History for real this time, the Mongol Empire seemed pretty cool. But, " +
                "I kinda like the Ottoman Empire more. They utilized gunpowder weapons early on, and lasted for quite a while. " +
                "Sad they became the dead man of Europe later, but at that time, Japan and the Meiji Restoration made " +
                "Japan my new favorite empire. And then the United States appeared after WWII. I love science, and the US making " +
                "atomic bombs first is pretty darn cool. Okay, time to move onto AP Calculus. See ya."
            },
            unlocked() {return player.arithmetic.unlocked},
        },
        d5: {
            title: "Document 5: The Area Surrounding",
            body() { return "Decided to not document AP Calculus. I already know almost all of the material. " + 
                "Instead, I left my little dorm room which I described in Document 1 and started exploring. " +
                "As I've told you in Document 2, The Void is a giant triangle. Some say it's equilateral, some say it's isosceles, " +
                "but I want to find out for myself, as the Centroid would be... in an interesting place... and I have plans." +
                "Outside, you can't really tell where you are besides the maps postered every so often on the walls, " +
                "and there are a few landmarks. 1, the Centroid, of course. 2, the labryinth, and only THREE people have made it out. " +
                "3, the reset field, which is the ONLY OTHER COLOR IN THE VOID: green. And 4, the transit. " +
                "It's the only place where you can enter and exit. Well, see ya. Have fun with Arithmetic Challenges."
            },
            unlocked() {return hasUpgrade("arithmetic", 17)},
        },
    },
    resetsNothing: true,
});