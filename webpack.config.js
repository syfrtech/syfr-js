const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: false,
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    filename: "main.sha256-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    hashFunction: "sha256",
    hashDigestLength: 256,
    clean: {
      keep: /js\//,
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "demo.html",
      template: "src/template.html",
    }),
  ],
};
