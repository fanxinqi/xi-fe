<template>
    <div class="container">
       <video ref="video" width="200px" height="150px"></video>
        <canvas ref="canvas" id="canvas" width="200px" height="150px"></canvas>
        <button @click="camera">拍照</button>
        <button @click="stop">结束</button>
    </div>
</template>

<script>
export default {
  data(){
      return {
          showVideo:this.showCamera
      }
  },
  props:["showCamera"],
  mounted() {
    console.log(this.$refs.video);
    // this.initCamera();
  },
  watch:{
    showVideo:function(oldValue,newValue){
        alert("show");
    }
  },
  methods: {
    onPlayerPlay(player) {},
    onPlayerPause(player) {},
    camera(){
        this.context.drawImage(this.$refs.video, 0, 0,200,150);
    },
    stop(){
        this.MediaStreamTrack && this.MediaStreamTrack.stop();
    },
    initCamera() {
      let canvas = this.$refs.canvas;
      this.context = canvas.getContext("2d");
      let video = this.$refs.video;
    //   this.MediaStreamTrack ;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true
          })
          .then((stream)=>{
            console.log(stream);
            this.MediaStreamTrack =
              typeof stream.stop === "function"
                ? stream
                : stream.getTracks()[1];
            video.src = window.URL.createObjectURL(stream);
            video.play();
          })
          .catch(function(err) {
            console.log(err);
          });
      } else if (navigator.getMedia) {
        navigator
          .getMedia({
            video: true
          })
          .then((stream)=>{
            console.log(stream);
            this.MediaStreamTrack = stream.getTracks()[1];
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  },
  computed: {}
};
</script>

<style lang="scss">
</style>
