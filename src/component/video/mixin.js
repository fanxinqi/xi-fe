const RemoveControlNames = [
            "volumePanel",
            "fullscreenToggle",
            "durationDisplay",
            "progressControl",
            "currentTimeDisplay"
    ],
    addControlNames = [
            "currentTimeDisplay",
            "progressControl",
            "durationDisplay",
            "fullscreenToggle"
    ],
    liveHideNames = [
            "currentTimeDisplay",
            "progressControl",
            "durationDisplay"
    ];

const mixin = {
    mounted: function () {
        this.$player = this.$refs.videoPlayer.player;
        //删除默认组件
        removeControlBar.call(this);
        //添加自定义组件
        addControlBar.call(this, addControlNames)
        if (this.isLive) {
            hideControlBar.call(this)
        }
        addUserPanal.call(this);
    }
}


const hideControlBar = function () {
    liveHideNames.forEach((name)=>{
        this.$player.controlBar.getChild(name).el().style.visibility = "hidden";
    });
}
const removeControlBar = function () {
    RemoveControlNames.forEach( (name)=> {
        this.$player.controlBar.removeChild(name)
    })
    this.$player.removeChild("bigPlayButton");
}

const addControlBar = function (controlNames) {
    controlNames.forEach( (name)=>{
        this.$player.controlBar.addChild(name)
    })
}

const pool={};

const h=function(tagName,props={},children=[]){
    let  _el = document.createElement(tagName),
        id=props["id"];
    if(!id) throw "require id in props";

    //set attr
    for(let name in props){
        let _propValue=props[name]
        _el.setAttribute(name,_propValue)
    }
    // render Children
    children.forEach(function(tag){
        _el.appendChild(tag);
    });

    //cash
    pool[id]=_el;
    return _el;
}

const addUserPanal = function () {

   const el= h("div",{
            class:"user-panel",
            id:"userPanel"
        },
          [
            h("div",
                    {
                        class:"box",
                        id:"box"
                    },
                    [
                        h(
                            "div",
                            {
                                class:"play-icon",
                                id:"playIcon"
                            },
                            [
                                h("div",
                                    {
                                        class:"play",
                                        id:"play"
                                    }
                                    )
                            ]
                        )

                    ]
                )
        ]
    );

    let container= document.querySelector(".video-js");
        container.appendChild(el);

    let $icon =pool["playIcon"],
       $play =pool["play"],
       $userPanel =pool["userPanel"];


    const show = function () {
        $userPanel.style.display = "block";
    }

    const hide = function () {
        $userPanel.style.display = "none";
    }


    this.$player.on("useractive", function (e) {
        show();
    })
    this.$player.on("userinactive", function (e) {
        hide();
    })

   this.$player.controlBar.getChild("fullscreenToggle").on("tap",()=>{
    //    if(this.$player.isFullscreen_){
    //        $userPanel.setAttribute("class","user-panel full")
    //    }
    //    else{
    //        $userPanel.setAttribute("class","user-panel")
    //    }
   })
//    window.onresize = function() {
//         if (!exitFull()) {
//             //要执行的动作
//             $userPanel.setAttribute("class","user-panel")
//         }
//     }
    //无法直接横屏
    $icon.addEventListener("click", ()=>{
        if (this.$player.techGet_("paused")) {
            $play.setAttribute("class", "suspend")
            this.$player.play();
        }
        else {
            $play.setAttribute("class", "play")
            this.$player.pause();
        }
    })


}

  //退出全屏 判断浏览器种类
//   function exitFull() {
//     // 判断各种浏览器，找到正确的方法
//     var exitMethod = document.exitFullscreen || //W3C
//         document.mozCancelFullScreen || //Chrome等
//         document.webkitExitFullscreen || //FireFox
//         document.webkitExitFullscreen; //IE11
//     if (exitMethod) {
//         exitMethod.call(document);
//     } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
//         var wscript = new ActiveXObject("WScript.Shell");
//         if (wscript !== null) {
//             wscript.SendKeys("{F11}");
//         }
//     }
// }

export  default  mixin;