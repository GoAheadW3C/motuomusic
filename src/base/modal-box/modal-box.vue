<template>
  <div id="modal-box">
  	<slot></slot>
  </div>
</template>

<script>
export default {
  name: 'modalbox',
  data () {
    return {
      msg: 'yuhua'
    }
  }
}
</script>


<style scoped>
#modal-box{
	position: fixed;
	left: 0;
	right: 0;
	top: 0rem;
	bottom: 0rem;
	background: rgba(0,0,0,.7);
	z-index: 2001;
	text-align: center;
}

</style>