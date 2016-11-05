<template>
	<div id="app">
		<upload-form></upload-form>
	</div>
</template>


<script>
import UploadForm from './components/UploadForm.vue'

export default {
	name: 'app',

	components: {
		UploadForm
	}
}
</script>


<style lang="sass">
*
	font-family: 'Lato', sans-serif
	font-weight: 300
	
strong
	font-weight: 400

.list-inline
	list-style-type: none
	padding: 0
	margin: 0

	&__item
		display: inline
		margin-right: 20px
		&--last
			margin-right: 0
</style>