/**
 * top level container
 * @author chengxiao
 */
import Vue from 'vue';
import noPage from '../page/404.vue';
import loginPage from '../page/login.vue';
import errorPage from '../page/error.vue';

import {filter as filters, util} from '../lib/tools';

for(var key in filters) {
    Vue.filter(key, filters[key]);
}

const isFatalError = function() {
    return false;
    // if(this.routeName === this.$route.name && !(this.$route.name && this.$store.state['current-user'])) {
    //     return true;
    // }
    // return false;
};
const needLogin = function() {
    return this.$store.state['user-id'] == -1;
};

export default function(view) {
    return {
        data() {
            return { };
        },
        watch: {
            location: {
                handler: function(curr, prev) {
                    const params = util.getDataByMap(this.$store.state, router.getParamsMap(), this.$route.params);
                    let toName = '';
                    if('string' === typeof curr) {
                        toName = curr;
                    } else {
                        toName = curr.name;
                        if(curr.params) {
                            Object.assign(params, curr.params);
                        }
                    }
                    const to = {
                        name: toName,
                        params
                    };
                    toName && this.$router.push(to);
                }
            },

            // message(event) {
            //     const val = event && event.msg;
            //     if(val) {
            //         this.$Message.info({
            //             duration: 3,
            //             content: val
            //         });
            //     }
            // }
        },
        computed: {
            location() {
                return this.$store.state.location;
            },
            // message() {
            //     return this.$store.state.message;
            // }
        },
        created() {
            this.routeName = this.$route.name;
        },
        beforeUpdate() {
            if(this.routeName === this.$route.name) {
                return ;
            }

            this.routeName = this.$route.name;
        },

        render(h) {
            if(isFatalError.call(this)) {
                return h(errorPage, {
                    props: {
                        message: 'Fatal Error'
                    }
                });

            }
            if(needLogin.call(this)) {
                return h(loginPage);
            }
            return h(view);
        }

    };

}
