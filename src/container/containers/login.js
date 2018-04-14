const LoginContainer = function (view, options) {
    return {
        data() {
            return {
                viewName,
                proxyAction: {}
            }
        },
        render(h) {
            return h(view, {
                props: {
                     data:data.data
                }
            });
        }   
    };
};
export default LoginContainer;
