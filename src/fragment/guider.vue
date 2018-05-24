<template>
    <router-link :to="to" :class="{active: isCurrent}">
        <slot></slot>
    </router-link>
</template>

<style scoped>
.active {
    color: #39f;
}

</style>

<script>
import router from '/app/router';

const {getRouteByName} = router;

export default {
    data: function() {
        return {

        };
    },
    props: ['to', 'match'],
    computed: {
        isCurrent: function() {
            let rule = getRouteByName(this.$route.name);
            const match = this.match;

            if(match.parent) {
                return (rule.parent === match.parent);
            }

            if(match.ancestor) {
                while(rule && rule.parent) {
                    if(rule.parent === match.ancestor) {
                        return true;
                    }
                    rule = getRouteByName(rule.parent);
                }
                return false;
            }

            if(match.children) {
                return match.children.some(name => {
                    return name === rule.name;
                });
            }

            return false;

        }
    }

};

</script>
