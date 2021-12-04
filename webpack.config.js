/**
 *
 * @see https://webpack.js.org/
 *
 * integrity to allow us to host the js
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
 * @see https://github.com/waysact/webpack-subresource-integrity/tree/main/examples/webpack-assets-manifest/
 * @see https://github.com/webdeveric/webpack-assets-manifest#integrity
 *
 * will likely need to update crossorigin
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 *
 * @todo should restore contenthash in filename to ensure never repeat?
 */
const path = require("path");
const dotenv = require("dotenv").config({ path: "./.env" });
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");
const WebpackAssetsManifest = require("webpack-assets-manifest");
var PACKAGE = require("./package.json");
var version = PACKAGE.version;

module.exports = {
  mode: "production",
  devtool: false,
  entry: {
    syfr: path.resolve(__dirname, "src/index.ts"),
  },
  output: {
    filename: `js/syfr-${version}.min.js`,
    path: path.resolve(__dirname, "dist"),
    library: { name: "Syfr", type: "var" },
    // hashFunction: "sha256",
    // hashDigestLength: 256,
    // crossOriginLoading: "anonymous",
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
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     filename: "demo.html",
  //     template: "src/template.html",
  //     syfrFormId: dotenv.parsed.SYFR_FORM_ID,
  //     minify: false,
  //     // inject: "body",
  //   }),
  //   // using subresourceintegrity causes js to fail to load in browser
  //   // new SubresourceIntegrityPlugin(),
  //   new WebpackAssetsManifest({ integrity: true }),
  // ],
};
