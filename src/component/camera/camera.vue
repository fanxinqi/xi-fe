<template>
    <div class="container">
       <video ref="video" width="200px" height="150px"></video>
        <canvas ref="canvas" id="canvas" width="200px" height="150px"></canvas>
        <button @click="camera">拍照</button>
        <button @click="upload">上传</button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      showVideo: this.showCamera,
      imageEntity:{}
    };
  },
  props: ["showCamera"],
  mounted() {
    console.log(this.$refs.video);
    // this.initCamera();
  },
  watch: {
    showVideo: function(oldValue, newValue) {
      alert("show");
    }
  },
  methods: {
    onPlayerPlay(player) {},
    onPlayerPause(player) {},
    camera() {
      this.context.drawImage(this.$refs.video, 0, 0, 200, 150);
      console.log(this.getBase64Data());
    },
    stop() {
      this.MediaStreamTrack && this.MediaStreamTrack.stop();
    },
    getBase64Data() {
      return this.$refs.canvas.toDataURL("image/jpeg");
    },
    upload() {
      this.$store.dispatch("proxyAction", {
        name: "upload-camera",
        queries: null,
        data: {
          base64Data: this.getBase64Data()
        },
        message: true
      }).then((res)=>{
          this.$emit('upload-success',res.data.data)
      });
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
            audio: false
          })
          .then(stream => {
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
          .then(stream => {
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
