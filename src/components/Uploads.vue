<template>
	<div>
		<div class="uploads" v-show="files.length">
			<ul class="list-inline">
				<li class="list-inline__item">Files: {{ files.length }}</li>
				<li class="list-inline__item">Percentage: {{ overallProgress }}%</li>
				<li class="list-inline__item  list-inline__item--last">Time remaining: {{ formattedTimeRemaining }}</li>
			</ul>
		</div>
		<file v-for="file in files" :file="file"></file>
	</div>
</template>


<script>
import File from './File.vue'
import eventHub from '../events.js'
import timeRemaining from '../helpers/timeremaining.js'
import pad from '../helpers/pad.js'

export default {
	data() {
		return {
			// overallProgress: 0,
			interval: null,
			secondsRemaining: 0
		}
	},

	props: {
		files: {
			type: Array,
			required: true
		}
	},

	computed: {
		unfinishedFiles() {
			let files = []

			this.files.forEach(file => {
				if (!file.cancelled && !file.failed && !file.finished)	{
					files.push(file)
				}
			})

			return files
		},
		finishedFiles() {
			let files = []

			this.files.forEach(file => {
				if (file.finished)	{
					files.push(file)
				}
			})

			return files
		},
		formattedTimeRemaining() {
			let minutes = Math.floor(this.secondsRemaining / 60)
			let seconds = this.secondsRemaining - (minutes * 60)

			return pad.left('00', minutes) + ':' + pad.left('00', seconds);
		},
		overallProgress() {			
			let totalProgress = 0

			this.unfinishedFiles.forEach(file => {
				totalProgress += file.progress
			})

			if (this.unfinishedFiles.length === 0 && this.finishedFiles.length > 0) {
				return 100
			}
				return parseInt(totalProgress / this.unfinishedFiles.length || 0)
		}
	},

	methods: {
		updateTimeRemaining() {
			this.secondsRemaining = 0
			this.unfinishedFiles.forEach(file => {
				file.secondsRemaining = timeRemaining.calculate(file.totalBytes, file.loadedBytes, file.timeStarted)
				this.secondsRemaining += file.secondsRemaining
			})
		}
	},

	mounted() {
		eventHub.$on('init', () => {
			if (!this.interval) {
				this.interval = setInterval(() => {
					if (this.unfinishedFiles.length === 0) {
						clearInterval(this.interval)	
						this.interval = null
					}
					this.updateTimeRemaining()
				}, 1000)
			}
		})
	},

	components: {
		File
	}
}
</script>


<style lang="sass">
.uploads
	text-align: center
	margin-bottom: 20px
</style>