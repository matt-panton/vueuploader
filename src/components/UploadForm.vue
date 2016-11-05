<template>
	<div
		class="dragndrop"
		:class="{'dragndrop--dragged':isDraggedOver}"
		@dragover.prevent="enter"
		@dragenter.prevent="enter"
		@dragleave.prevent="leave"
		@dragend.prevent="leave"
		@drop.prevent="drop"
	>
		<input type="file" name="files[]" multiple id="file" class="dragndrop__input" @change="selectFile" ref="input">

		<label for="file" class="dragndrop__header" :class="{'dragndrop__header--compact':hasFiles}">
			<strong>Drag files here</strong> or click to select files
		</label>

		<uploads :files="files" v-show="hasFiles"></uploads>
	</div>
</template>


<script>
import Uploads from './Uploads.vue'
import eventHub from '../events.js'

export default {
	data() {
		return {
			files: [],
			isDraggedOver: false
		}
	},

	computed: {
		hasFiles() {
			return this.files.length > 0
		}
	},

	methods: {
		enter() {
			this.isDraggedOver = true
		},
		leave() {
			this.isDraggedOver = false
		},
		drop(e) {
			this.leave();
			this.addFiles(e.dataTransfer.files)
		},
		selectFile(e) {
			this.addFiles(this.$refs.input.files)
		},
		addFiles(files) {
			for (let i = 0; i < files.length; i++) {
				let file = files[i]
				this.storeMeta(file).then(fileObject => {
					this.upload(fileObject)
				}, fileObject => {
					fileObject.failed = true
				})
			}
		},
		storeMeta(file) {
			let fileObject = this.generateFileObject(file)

			return new Promise((resolve, reject) => {
				this.$http.post('http://vue-uploader.dev/store.php', {name:file.name}).then(response => {
					fileObject.id = response.body.data.id
					resolve(fileObject)
				}, () => {
					reject(fileObject)
				})
			})
		},
		generateFileObject(file) {
			let fileObjectIndex = this.files.push({
				id: null,
				file: file,
				progress: 0,
				failed: false,
				loadedBytes: 0,
				totalBytes: 0,
				timeStarted: (new Date).getTime(),
				secondsRemaining: 0,
				finished: false,
				cancelled: false,
				xhr: null
			}) - 1

			return this.files[fileObjectIndex]
		},
		upload(fileObject) {
			let form = new FormData()
			form.append('file', fileObject.file)
			form.append('id', fileObject.id)

			eventHub.$emit('init')

			this.$http.post('http://vue-uploader.dev/upload.php', form, {
				before: (xhr) => fileObject.xhr = xhr,
				progress: (e) => {
					eventHub.$emit('progress', fileObject, e)
				}
			}).then(response => {
				eventHub.$emit('finished', fileObject)
			}, response => {
				eventHub.$emit('failed', fileObject)
			})
		}
	},

	components: {
		Uploads
	}
}
</script>


<style lang="sass" scoped>
$minHeight: 200px

.dragndrop
	box-sizing: border-box
	padding: 0 15px
	width: 100%
	min-height: $minHeight
	background: #f8f8f8
	position: relative
	border: 3px dashed rgba(0,0,0,0.2)
	&--dragged
		border-color: #333

	&__input
		position: absolute
		left: -2000px
		visibility: hidden

	&__header
		display: block
		font-size: 1.1em
		color: #555
		vertical-align: middle
		text-align: center
		margin: $minHeight/2 20px
		&:hover
			text-decoration: underline
			cursor: pointer
		&--compact
			margin: $minHeight/4 20px
</style>