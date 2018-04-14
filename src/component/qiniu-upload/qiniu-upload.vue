<template>
    <Upload ref="upload"
        v-bind="$attrs"
        v-on="$listeners" 
        :action="action"
        :data="formData"
        :before-upload="handleBeforeUpload"
        :on-success="handleOnSuccess"
    >
        <slot name="tip" slot="tip"></slot>
        <slot></slot>
    </Upload>
</template>
<script type="text/ecmascript-6">

    import Upload from "./upload.vue"
    import jsonp from 'jsonp';
    const action = "http://upload-z0.qiniu.com";
    let host = "http://yanxiuugcpic.jsyxw.cn";
    const tokenUrl = `__serverUrl__/7up/platform/data.api?method=upload.token&dtype=web&from=100`;
    const fetchToken = function(passportToken){
        return new Promise((resolve, reject)=>{
            jsonp(`${tokenUrl}&token=${passportToken}`, (err, res)=>{
                if(err) {
                    reject(err);
                } else {
                    if(res && res.data && res.data.token){
                        resolve(res.data);
                    } else {
                        reject("NOT_LOGIN");
                    }
                }
            });
        });
    }


    const QiniuUpload = {
        name: "qiniuUpload",
        components: {Upload},
        inheritAttrs: false,
        props: {
            'data': Object,
            'passportToken': String, // 传入用户passport的token
            'beforeUpload': Function,
            'onSuccess': Function,
            'action': {
                type: String,
                default: action
            }
        }
        ,
        data: function () {
           
            return {
                formData: Object.assign({
                    token: ""
                }, this.$props.data)
            }
        },
        methods: {
            handleBeforeUpload:async function(file){
                
                if(this.$props && this.$props.beforeUpload instanceof Function) {
                    
                    let returnValue = await this.$props.beforeUpload(file);
              
                    if(returnValue === false) {
                        return false;
                    }
                }
                
                let res = "";
                try{
                    res = await fetchToken(this.$props.passportToken);
                }catch(e) {
                    console.warn(e);
                    
                    if(this.$attrs && this.$attrs["on-error"] instanceof Function) {
                     
                        this.$attrs["on-error"](e, file);
                       
                    }
                    
                    return new Promise((resolve, reject)=>{
                        reject(e);
                    });
                }


                this.formData.token = res.token;
                host = res.host;
    
            },
            handleOnSuccess: async function(response, file, fileList){
                

                file.url = `${host}/${response.key}`;
                file.name = response.hash;
                if(this.$props && this.$props.onSuccess instanceof Function) {
                    return await this.$props.onSuccess(response, file, fileList);
                }
            },
            clearFiles: function(){
                this.$refs.upload.clearFiles();
            }
        }


    }



    export default QiniuUpload;
</script>
