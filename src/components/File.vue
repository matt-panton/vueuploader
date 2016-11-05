<template>
	<div class="file">
		<div class="file__progress">
			<div
				class="file__progress-fill"
				:style="{width: file.progress + '%'}"
				:class="progressFillClasses"
			></div>
			<div class="file__label">
				<a href="#" class="file__cancel" @click.prevent="cancel" v-show="!file.finished && !file.cancelled">Cancel</a>
				{{ file.file.name }}
				<span v-show="!file.finished && !file.failed && !file.cancelled">({{ file.secondsRemaining }} seconds remaining)</span>
			</div>
			<div class="file__status">{{ statusText }}</div>

		</div>
	</div>
</template>


<script>
import eventHub from '../events.js'

export default {
	props: {
		file: {
			type: Object,
			required: true
		}
	},

	computed: {
		progressFillClasses() {
			return {
				'file__progress-fill--finished': this.file.finished,
				'file__progress-fill--failed': this.file.failed || this.file.cancelled
			}
		},
		statusText() {
			if (this.file.failed) {
				return 'Failed'
			} else if (this.file.cancelled) {
				return 'Cacelled'
			}

			return this.file.progress + '%'
		}
	},

	methods: {
		updateFileObjectProgress(fileObject, e) {
			if (!e.lengthComputable) {
				return
			}
			fileObject.loadedBytes = e.loaded
			fileObject.totalBytes = e.total
			fileObject.progress = Math.ceil((e.loaded / e.total) * 100)
		},
		cancel() {
			this.file.xhr.abort()
			this.file.cancelled = true
		}
	},

	mounted() {
		eventHub.$on('progress', (fileObject, e) => {
			this.updateFileObjectProgress(fileObject, e)
		})
		eventHub.$on('finished', (fileObject) => {
			if (fileObject.id == this.file.id) {
				this.file.finished = true
			}
		})
		eventHub.$on('failed', (fileObject) => {
			if (fileObject.id == this.file.id) {
				this.file.failed = true
			}
		})
	}
}
</script>


<style lang="sass">
.file
	margin: 0 0 15px 0
	font-size: 0.9em
	position: relative

	&__progress
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.1)
		border-radius: 3px
		background-color: #F5F5F5

	&__progress-fill
		border-radius: 3px
		background: #34B983
		position: absolute
		left: 0
		top: 0
		bottom: 0
		box-shadow: inset 0 -1px rgba(0,0,0,0.2)
		transition: width 0.2s ease
		opacity: 0.6
		&--failed
			width: 100% !important
			background: #F66
		&--finished
			opacity: 1

	&__cancel
		text-decoration: none
		color: #000
		margin-right: 10px
		&:hover
			text-decoration: underline

	&__label,
	&__status
		line-height: 35px
	
	&__label
		padding: 0 60px 0 5px
		position: relative
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis
	
	&__status
		position: absolute
		top: 0
		right: 5px
</style>