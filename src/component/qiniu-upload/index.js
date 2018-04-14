import Upload from './upload.vue';
import QiniuUpload from './qiniu-upload.vue';
Upload.install = function(Vue){
	Vue.component('upload', Upload);
}
QiniuUpload.install = function(Vue){
    Vue.component('qiniu-upload', QiniuUpload);
}

export default QiniuUpload;
