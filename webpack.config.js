const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "main.sha256-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    hashFunction: "sha256",
    hashDigestLength: 256,
    clean: {
      keep: /js\//,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "demo.html",
      template: "src/template.html",
    }),
  ],
};
