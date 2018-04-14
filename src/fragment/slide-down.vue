<template>
    <div class="slide-down">
        <div class="main-content">
            <slot name="main"></slot>
            <slot name="button"></slot>  
        </div>
        <div class="shadow" @click="setShowShadowa"></div>        
    </div>

</template>

<script>

    export default {
        props: ['showShadow'],
        data() {
            return {};
        },
        computed: {
        },
        methods: {
            setShowShadowa() {
                this.$emit('setShowShadow');
            }
        }
    };

</script>
<style scoped>
    .slide-down .main-content {
        z-index: 101;
        position: relative;
        background: #fff;
    }
    .shadow {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background: #000;
        z-index: 100;
    }
</style>
