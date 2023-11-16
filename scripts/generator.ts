class Color {
	public r: number;
	public g: number;
	public b: number;
	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

let CHAT_COLORS_BY_VERSION_FN = () => {
	let fakePersimmon = new Color(253, 41, 67);
	let fakeCyan = new Color(1, 162, 255);
	let fakeDarkGreen = new Color(2, 184, 87);
	let brightViolet = new Color(107, 50, 124)

	let t = [
		[
			new Color(196, 40, 28), // Bright red
			new Color(13, 105, 172), // Bright blue
			new Color(39, 70, 45), // Earth green
			brightViolet
		],
		[
			fakePersimmon,
			fakeCyan,
			fakeDarkGreen,
			brightViolet
		],
		[
			fakePersimmon,
			fakeCyan,
			fakeDarkGreen,
			new Color(180, 128, 255) // Alder
		]
	]

	let unchangedColors = [
		new Color(218, 133, 65), // Bright orange
		new Color(245, 205, 48), // Bright yellow
		new Color(232, 186, 200), // Light reddish violet
		new Color(215, 197, 154), // Brick yellow
	]

	function move(src: any[], a: number, b: number, t: number, dist: any[]) {
		// dist[t], ... = src[a], ..., src[b]
		for (let i = 0; i <= b - a; i++) {
			let srcElement = src[i + a];
			let distIdx = t + i;
			// console.log(a, i, b, t, srcElement, distIdx);
			dist[distIdx] = srcElement;
		}
		return dist;
	}

	for (let i = 0; i < t.length; i++) {
		let colors = t[i];
		t[i] = move(unchangedColors, 0, unchangedColors.length - 1, colors.length, colors);
	}

	Object.freeze(t);
	return t;
}

let CHAT_COLORS_BY_VERSION = CHAT_COLORS_BY_VERSION_FN();

let ComputeNameValue = (username: string) => {
	let value = 0;
	for (let index = 0; index <= username.length - 1; index++) {
		let cVal = username.substring(index, index + 1)
		let cValue = cVal.charCodeAt(0);
		let reverseIndex = username.length - index;
		if (username.length % 2 === 1) {
			reverseIndex -= 1;
		}
		if (reverseIndex % 4 >= 2) {
			cValue = -cValue;
		}
		value += cValue;
	}
	return value;
}

let GetNameColor = (username: string, version_?: number) => {
	let chatColors = CHAT_COLORS_BY_VERSION[typeof version_ === 'number' ? version_ - 1 : CHAT_COLORS_BY_VERSION.length - 1];
	// let value = (ComputeNameValue(username) % chatColors.length); // +1 removed for TS-Lua indices conflict
	let cmv = ComputeNameValue(username);
	let len = chatColors.length;
	let value = cmv - Math.floor(cmv / len) * len // Removed cmv % len, the modulus operator is different in Lua when working with negative numbers
	// console.log(cmv, len, value);
	return chatColors[value];
}

export default GetNameColor;