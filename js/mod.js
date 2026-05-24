let modInfo = {
	name: "Justcubing97's Something Tree",
	author: "Justcubing97",
	pointsName: "Points",
	modFiles: ["achievements.js", "unlock.js", "fundamental.js", "primitive.js", "arithmetic.js", "addition.js", "subtraction.js", "multiplication.js", "dimension.js", "polygon.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.4.1",
	name: "Polygon layer update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.4.1</h3><br>
		- Fixed Arithmetic Challenge 1. <br>
		- Endgame: 1 Shape. <br>
	<h3>v0.4</h3><br>
		- Polygon layer. <br>
		- New currency: Shapes. <br>
		- 3 Arithmetic Challenges. <br>
		- 22 Achievements. <br>
		- Endgame: 1 Shape. <br>
	<h3>v0.3</h3><br>
		- Added Dimension and Multiplication layer. <br>
		- Added new currencies: Dimensions, Multiplication <br>
		- Added Arithmetic Challenges. <br>
		- Added more Achievements. <br>
		- Endgame: 3 Dimensions. <br>
	<h3>v0.2</h3><br>
		- Added Arithmetic layer. <br>
		- Added new currencies: Addition, Subtraction <br>
		- Endgame: 25 Operation Power. <br>
	<h3>v0.1</h3><br>
		- Added Unlock, Fundamental, and Primitive layers. <br>
		- Endgame: 1e15 Numbers. <br>`

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
	if (getClickableState("addition", 13) == "Active" && !inChallenge("arithmetic", 12)) gain = gain.add(clickableEffect("addition", 13))
	//mul
	if (hasUpgrade("fundamental", 11)) gain = gain.mul(2)
	if (hasUpgrade("fundamental", 12)) gain = gain.mul(3)
	if (hasUpgrade("fundamental", 15)) gain = gain.mul(3)
	if (hasUpgrade("fundamental", 16)) gain = gain.mul(15)
	if (hasUpgrade("fundamental", 17)) gain = gain.mul(upgradeEffect("fundamental", 17))
	if (hasMilestone("primitive", 1)) gain = gain.mul(50)
	if (hasUpgrade("fundamental", 26)) gain = gain.mul(25)
		
	if (!inChallenge("arithmetic", 11)) gain = gain.mul(buyableEffect("fundamental", 11))

	if (hasUpgrade("primitive", 14)) gain = gain.mul(upgradeEffect("primitive", 14))
	if (hasMilestone("primitive", 4)) mult = mult.mul(100)
	if (hasUpgrade("fundamental", 33)) gain = gain.mul(1000000)
	if (hasUpgrade("fundamental", 35)) gain = gain.mul(1000)
	if (hasUpgrade("arithmetic", 11)) gain = gain.mul(100)
	if (hasUpgrade("arithmetic", 14)) gain = gain.mul(upgradeEffect("arithmetic", 14))
	if (hasUpgrade("primitive", 23)) gain = gain.mul(1e10)
	if (hasUpgrade("subtraction", 13)) gain = gain.mul(100)
	if (hasUpgrade("arithmetic", 21)) gain = gain.mul(upgradeEffect("arithmetic", 21))
	if (hasUpgrade("multiplication", 21)) gain = gain.mul("1e15")
	if (hasUpgrade("arithmetic", 23)) gain = gain.mul("500")
	//exp
	if (hasUpgrade("arithmetic", 15)) gain = gain.pow(1.1)
	if (inChallenge("arithmetic", 11)) gain = gain.pow(0.8)
	if (inChallenge("arithmetic", 12)) gain = gain.pow(0.5)
	if (player.multiplication.points.gte(1)) gain = gain.pow(player.multiplication.effect)
	if (inChallenge("arithmetic", 13)) gain = gain.pow(0.75)
	if (hasChallenge("arithmetic", 13)) gain = gain.pow(1.05)
	if (hasUpgrade("arithmetic", 26)) gain = gain.pow(1.05)
	//other hypers
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current endgame: 1 Shape <br> JST by Justcubing97"
]

// Determines when the game "ends"
function isEndgame() {
	return (player.polygon.points.gte(new Decimal("1")))
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