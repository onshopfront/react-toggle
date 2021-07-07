const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/docs/index.tsx'),
  devtool: 'source-map',

  output: {
    path: path.join(__dirname, 'dist/docs'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.[jt]s(x?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    static: [path.join(__dirname, 'dist/docs')],
    host: 'localhost',
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname, 'src/docs/index.html') },
      ],
    }),
  ],
}
