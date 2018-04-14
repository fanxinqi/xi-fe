const loaderUtils=require("loader-utils");

module.exports = function(content) {
    const options = loaderUtils.getOptions(this),
          rm=options.replaceMap;
    if(rm){
        Object.keys(rm).forEach(function(key){
            content=content.replace(key,rm[key]);
        });
    } 
    return content;
};