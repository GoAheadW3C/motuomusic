<template>
  	<canvas width="40" height="40" ref="circle" style="background:blue;"></canvas>
</template>

<script>
export default {
  name: 'progressCircle',
  mounted(){
  	// this.$refs.circle.setAttribute('width',80);
  	this.ctx=this.$refs.circle.getContext('2d');
  	this.ctx.arc(16,16,16,-0.5*Math.PI,-0.5*Math.PI+2*Math.PI*1);  // arc(x,y,r,开始弧度,结束弧度)
	this.ctx.strokeStyle = 'gold';
	this.ctx.lineWidth=3
	this.ctx.stroke();
  }
}
</script>

<style>


</style>