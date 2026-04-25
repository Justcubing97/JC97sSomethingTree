addLayer("a", {
  name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
  color: "#FFFF00",
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
      unlocked: true,
  points: new Decimal(0),
  }},
  tooltip:"Achievements",
  resource: "achievements", // Name of prestige currency
  type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  row: "side", // Row the layer is in on the tree (0 is the first row)
tabFormat: [
  ["display-text", () => `You have ${player.a.achievements.length}/n achievements`],
  "blank",
  "achievements"
],
  layerShown(){return true},
achievements: {
  11: {
    name: "The Beginning.",
    done(){return hasUpgrade("unlock", 11)},
    tooltip:"Unlock the Fundamental layer.",
    unlocked() {return true},
  },
  12: {
    name: "Slight Progression",
    done(){return hasUpgrade("fundamental", 17)},
    tooltip:"Get \"Progressing\" in Fundemental layer.",
    unlocked() {return true},
  },
  13: {
    name: "Millionare!",
    done(){return player.points.gte("1e6")},
    tooltip:"Have 1,000,000 points.",
    unlocked() {return true},
  },
  14: {
    name: "Oh no, math!",
    done(){return player.primitive.points.gte(1)},
    tooltip:"Primitive reset for the first time.",
    unlocked() {return true},
  },
  15: {
    name: "Decillionare!",
    done(){return player.points.gte("1e33")},
    tooltip:"Have 1e33 points.",
    unlocked() {return true},
  },
  16: {
    name: "Softcap era...",
    done(){return player.fundamental.points.gte("1e50")},
    tooltip:"Reach the Fundamentality softcap.",
    unlocked() {return true},
  },
  17: {
    name: "Googol!",
    done(){return player.points.gte("1e100")},
    tooltip:"Have 1e100 Points.",
    unlocked() {return true},
  },
  21: {
    name: "JST Enjoyer",
    done(){return player.fundamental.points.gte("1e30")},
    tooltip:"Have 1e30 Numbers.",
    unlocked() {return true},
  },
  22: {
    name: "I HATE MATH!",
    done(){return player.arithmetic.points.gte(1)},
    tooltip:"Arithmetic reset for the first time.",
    unlocked() {return true},
  },
  23: {
    name: "Googol again?",
    done(){return player.fundamental.points.gte("1e100")},
    tooltip:"Have 1e100 Fundamentality.",
    unlocked() {return true},
  },
},
})