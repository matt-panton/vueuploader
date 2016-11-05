export default {
	cache: {
		averageSpeed: null
	},

	_getMovingAverage(bytesPerSeconds) {
		if (!this.averageSpeed) {
			this.averageSpeed = bytesPerSeconds
		}

		return 0.005 * bytesPerSeconds + (1 - 0.005) * this.averageSpeed
	},

	calculate(totalBytes, loadedBytes, timeStarted) {
		if (!totalBytes || !loadedBytes) {
			return 0
		}

		let secondsElapsed = (new Date().getTime() - timeStarted) / 1000

		let bytesPerSeconds = secondsElapsed ? loadedBytes / secondsElapsed : 0

		return Math.ceil((totalBytes - loadedBytes) / this._getMovingAverage(bytesPerSeconds))
	}
}