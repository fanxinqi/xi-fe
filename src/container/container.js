import appContainer from './app';
import pageContainer from './page';
import loginContainer from './containers/login'

const containers = {
    app: appContainer,
    page: pageContainer,
    login:loginContainer
};

const createContainer = function(options) {
    options = options || {};
    let name;
    if('object' !== typeof options) {
        options = {routerName: String(options)};
    }
    let container = containers[options.routerName];
    if(!container) {
        container = pageContainer;
    }
    return function(view) {
        if(!view) {
            return null;
        }
        if(options.pickerSpy) {
            options.picker = options.pickerSpy(view.picker);
        }   
        return container(view, options);
    };
};

export default createContainer;
