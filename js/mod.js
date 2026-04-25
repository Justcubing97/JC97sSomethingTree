let modInfo = {
	name: "Justcubing97's Something Tree",
	author: "Justcubing97",
	pointsName: "Points",
	modFiles: ["achievements.js", "unlock.js", "fundamental.js", "primitive.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Release Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Added Unlock, Fundamental, and Primitive layers. Endgame: 1e15 Numbers."`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	//add
	if (hasUpgrade("fundamental", 13)) gain = gain.add(1)
	if (hasUpgrade("fundamental", 16)) gain = gain.add(5)
	if (hasUpgrade("primitive", 11)) gain = gain.add(5)
	//mul
	if (hasUpgrade("fundamental", 11)) gain = gain.mul(2)
	if (hasUpgrade("fundamental", 12)) gain = gain.mul(3)
	if (hasUpgrade("fundamental", 15)) gain = gain.mul(3)
	if (hasUpgrade("fundamental", 16)) gain = gain.mul(15)
	if (hasUpgrade("fundamental", 17)) gain = gain.mul(upgradeEffect("fundamental", 17))
	if (hasMilestone("primitive", 1)) gain = gain.mul(50)
	if (hasUpgrade("fundamental", 26)) gain = gain.mul(25)
	if (getBuyableAmount("fundamental", 11).gte(1)) gain = gain.mul(buyableEffect("fundamental", 11))
	if (hasUpgrade("primitive", 14)) gain = gain.mul(upgradeEffect("primitive", 14))
	if (hasMilestone("primitive", 4)) mult = mult.mul(100)
	//exp
	//other hypers
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.primitive.points.gte(new Decimal("15e14"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}