const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path');
const webpack =require("webpack");
var ImageminPlugin = require('imagemin-webpack-plugin').default
const resolve=(dir)=>{
    return path.join(__dirname, '.', dir)
}

const pathRewrite = function (path, req) {
    const query=req.query,
        method=query.method;
    let  targetUrl="404.html"
    if(method){
        const action= method.split(".")
        targetUrl = ""
        for(let i in action) {
            targetUrl+=`/${action[i]}`
        }
        targetUrl+='.json'
    }
    return path.replace(/^\/data.api/,  targetUrl)
}

const mockProxy={
    '/lv/platform/data.api/*': {
    target: 'http://127.0.0.1:8989',
    pathRewrite,
    changeOrigin: true
  },
    '/basicdata/platform/data.api/*': {
        target: 'http://127.0.0.1:8989',
        pathRewrite,
        changeOrigin: true
    }
}

// const serverProxy={
//     "/api": "http://127.0.0.1:9992"
// }
const serverProxy={
    "/api": "http://192.168.1.170:8092"
}
console.log(process.env.NODE_ENV);

const webpackConfig={
    module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                  scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                  sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax', // <style lang="sass">
                  js: [
                    {
                    loader: 'babel-loader',
                    options:{  
                        presets: [["stage-3"]],
                        plugins: [
                          'syntax-dynamic-import',
                          'transform-async-to-generator',
                          'transform-regenerator',
                          'transform-runtime',
                          'transform-vue-jsx'
                        ]
                    }  }
                  ]
                  
                }
              }
          },
        // {
        //     test: /\.(vue|js)$/,
        //     use: [{
        //         loader:path.resolve('loader/replace.js'),
        //         options: {
        //             replaceMap: {
        //                 "__serverUrl__":process.env.NODE_ENV==="product"?"http://niuugcupload.yanxiu.com":"http://orz.yanxiu.com",
        //                 "__xuexueduanurl__":process.env.NODE_ENV==="product"?"http://b.yanxiu.com":""
        //             }
        //         }
        //       }
        //     ]
        //     },
            {  
                    test:/\.js$/,  
                    exclude:/node_modules/,  
                    loader:'babel-loader',  
                    options:{  
                        presets: [["stage-3"]],
                        plugins: [
                          'syntax-dynamic-import',
                          'transform-async-to-generator',
                          'transform-regenerator',
                          'transform-runtime'
                        ]
                    }  
            }, 
          {
            test: /\.(css|scss)$/,
            use: [
               'style-loader',
               'css-loader',
               'sass-loader'
            ]
          },
            {
                test: /\.(css|scss)$/,
                exclude: /(node_modules|bower_components|src\/lib\/exculde)/,
                use: [
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    }
                ]
            },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use:[
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: ('dist/img/[name].[hash:7].[ext]')
                    }
                },
              
            ]      
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'dist/media/[name].[hash:7].[ext]'
            }
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'dist/fonts/[name].[hash:7].[ext]'
            }
          }
        ]
      },
    devtool:process.env.NODE_ENV === 'production'?'none':'line-source-map',
    resolve: {
        extensions: ['.js', '.vue', '.json','css'],
        alias: {
          '@': resolve('src'),
        }
    },
    plugins: [new HtmlWebpackPlugin(
        {
            template:"./index.html",
            tilte:"研修直播平台",
            minify:process.env.NODE_ENV === 'production'
        } 
    ),
    new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production', // Disable during development
        minFileSize: 10000, 
        pngquant: {
          quality: '95-100'
        }
      })
    ],
    devServer: {
       contentBase: './dist',
       watchOptions: {
            poll: true 
       },
    //    host: "192.168.9.112",
    //    host: "127.0.0.1",
    //   host: "192.168.9.111",
       // host: "192.168.7.71",
       proxy: serverProxy
    }
}

module.exports=webpackConfig;