const path = require("path");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const cssMiniWebpack = require("css-minimizer-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin")
module.exports = {
  mode: "production",
  entry: {
    cards: path.resolve(__dirname, 'cards_loading.js'),
    maps:  path.resolve(__dirname, 'mapdata.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader']
      }
    ],
  },
  plugins:[new miniCssExtractPlugin({
    filename:"[name].css"
  })],
  optimization:{
    minimize:true,
    minimizer:[new terserPlugin({
      terserOptions:{
        compress:true
      }
    }),new cssMiniWebpack()]
  }
}