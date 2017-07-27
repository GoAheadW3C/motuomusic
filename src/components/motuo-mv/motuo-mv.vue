<template>
  <div id="motuo-mv">
  <!-- <video> -->
 	<video class="it" width="320" src="http://lmbsy.qq.com/flv/77/85/b0024u29v0g.mp4?sdtfrom=v3010&guid=401e99c8dafb7cd3b1f083eba05684ad&vkey=738E5EBD04A043BB0A52B89B9BAC5F7BED52D2D6085E11E60D89E1D3693BCCD6D190A228A368D96AEAFDBFD782FB7243291CB9F8784ADF6B6A6A872D7BF3571E791526A5F0993CF3E7BF7BCD7CA66B5407EBEF430C42A5F6&platform=2"></video>
  </div>
</template>

<script>
export default {
  name: 'motuomv',
  data () {
    return {
      msg: 'yuhua'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#motuo-mv{
	position: fixed;
	width: 100%;
	top: 0;
	bottom: 0;
	/*background: red;*/
}
.it{
	position: absolute;
	z-index: 10000;
	width: 100%;
	height: 100%;
}
</style>