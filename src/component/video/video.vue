<template>
    <div class="container">
        <div class="player">
            <video-player class="video-player vjs-custom-skin"
                          ref="videoPlayer"
                          :playsinline="true"
                          :options="playerOptions"
                          @play="onPlayerPlay($event)"
                          @pause="onPlayerPause($event)"
            >
            </video-player>
        </div>
    </div>
</template>

<script>
    import 'video.js/dist/video-js.css'
    import { videoPlayer } from 'vue-video-player';
    import mixin from "./mixin"

    export default {
        mixins: [mixin],
        data () {
            return {
                playerOptions: {
                    //  playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        withCredentials: false,
                        type: this.type,
                        src: this.src
                    }],
                    isFullscreen:true,
                    flash: { hls: { withCredentials: false }},
                    html5: { hls: { withCredentials: false }},
                    poster: this.poster, //你的封面地址
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                }
            }
        },
        props:{
            src: {
                type: String
            },
            type: {
                type: String,
                default: 'application/x-mpegURL'
            },
            isLive:{
                type: Boolean,
                default: false
            },
            poster:{
                type:String
            }
        },
        components: {
            videoPlayer
        },
        methods: {
            onPlayerPlay(player) {

            },
            onPlayerPause(player){
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        }
    }


</script>

<style lang="scss">
    .video-js{
        width:750px !important;
        height: 422px !important;;
    }
    .video-js .vjs-control-bar{
        background-color:transparent;
        z-index: 1000;

    }
    .video-js .vjs-progress-control:hover .vjs-progress-holder{
        font-size:inherit !important;
    }
    .video-js button{
        width: 2em !important;
    }
    .video-js .vjs-time-control{
          padding-left:0em !important;
          padding-right:0em !important;
    }

    .vjs_video_3-dimensions.vjs-fluid{
        padding-top: 0px;
    }
    .vjs-current-time{
        display: inline-block !important;
    }
    .vjs-duration{
        display: inline-block !important;
    }
    .play{
        background: url(./img/play.png) no-repeat;
        background-size: cover;
    }
    .suspend{
        background: url(./img/suspend.png) no-repeat;
        background-size: cover;
    }
    .user-panel{
        background: rgba(0,0,0,0.3);
        display: inline-block;
        width:750px !important;
        height: 422px !important;;
        position: absolute;
        left:0px;
        top:0px;
    }
    .full{
        height: 100vh !important;;
    }
    .box{
        align-items:center;/*垂直居中*/
        justify-content: center;/*水平居中*/
        display: flex;
        width:100%;
        height:100%;
        .play-icon{
            background: rgba(0,0,0,0.6);
            width:88px;
            height:88px;
            align-items:center;/*垂直居中*/
            justify-content: center;/*水平居中*/
            display: flex;
            border-radius: 50%;
            .play{
                display: inline-block;
                height: 88px;
                width: 88px;

                background: url(./img/play.png) no-repeat;
                background-size: cover;
            }
            .suspend{
                display: inline-block;
                height: 88px;
                width: 88px;
                background: url(./img/suspend.png) no-repeat;
                background-size: cover;
            }
        }
    }


</style>
