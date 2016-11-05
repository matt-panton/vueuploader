export default {
	left(pad, string) {
		return this._pad(pad, string, true)
	},

	right(pad, string) {
		return this._pad(pad, string, false)
	},

	_pad(pad, string, left) {
		if (typeof string == 'undefined') {
			return pad
		}

		if (left) {
			return (pad + string).slice(-pad.length)
		}

		return (string + pad).substring(0, pad.length)
	}
}