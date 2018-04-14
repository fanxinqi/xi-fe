<template>
    <div class="footer">
        <div class="inner wrapper-main">
        </div>
    </div>
</template>

<script>

const beian = '湘ICP备16018503号-2';
export default {
    data: function() {
        return {
            beian,
            year: (new Date).getFullYear()
        };
    }
};

</script>

<style>
.footer{
    box-shadow: 0px 6px 20px #eee;
    background-color: #fefefe;
    margin-top: 100px;
    height: 150px;
    .site-name {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 22px;
    }
    .inner {
        color: #999;
        padding: 50px 0 0 0;
        margin: 0 auto;
        position: relative;
        .info {
            color: #ccc;
            font-size: 12px;
            line-height: 22px;
            .beian {
                text-align: right;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
}
</style>
