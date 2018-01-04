// _dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录
var path = require('path'); //node的path方法path.resolve([from ...], to)   将to解析到前者称为一个绝对路径
var webpack = require('webpack'); //引入webpack模块供我们调用，此处es6语法会报错
var HtmlWebpackPlugin = require('html-webpack-plugin'); //依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = { //注意这里是exports而不是export
  devtool: 'cheap-eval-source-map',

  entry: path.resolve(__dirname, './app/main.jsx'), //唯一入口文件，参考java中的main方法

  output: { //输出目录
    path: path.resolve(__dirname, './build'), //打包后的js文件存放的地方
    filename: "bundle.js", //打包后的文件名
    chunkFilename: '[name].[chunkhash:5].chunk.js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
  },
  module: {
    //loaders加载器
    rules: [{
        test: /\.jsx$/, //一个匹配loaders所处理的文件的扩展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/, //屏蔽不需要处理的文件(文件夹)(可选)
        loaders: 'babel-loader' //loaders的名称(可选)
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  //webpack-dev-server配置
  /*
  dev里各属性值的意思是---定位到package.json
  --devtool eval:为你的代码创建源地址。当有任何报错的时候可以让你更加精确地定位到文件和行号
  --progress: 显示合并代码进度
  --colors: 在命令行中显示颜色
  --content-base build:指向设置的输出目录
  */
  devServer: {
    contentBase: './build', //默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录(此处设置为build目录)
    historyApiFallback: true, //开发单页应用时非常有用，依赖于HTML 5 history API，设置为true,所有的跳转将指向index.htm
    inline: true, //设置为true,源文件改变时会自动刷新页面
    port: 9999, //设置默认端口，默认为‘8080’
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new webpack.HotModuleReplacementPlugin(), //热模块替换插件
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname,'./index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    })
  ]
}
