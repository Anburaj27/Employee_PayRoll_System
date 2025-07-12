// webpack.config.js
module.exports = {
  // other config...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/face-api.js/, // 👈 Exclude the faulty package
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
