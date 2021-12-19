/**
 * @see https://webpack.js.org/
 */
const path = require("path");
const dotenv = require("dotenv").config({ path: "./.env" });
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
var PACKAGE = require("./package.json");

module.exports = (env) => {
  var version = PACKAGE.version;
  let outputDir = env.production ? `public/${version}` : ".cache";
  let watch = !env.production;
  let baseName = "form-cipher";
  return {
    mode: "production",
    devtool: "source-map",
    entry: {
      [baseName + ".min"]: path.resolve(__dirname, "src/index.ts"),
    },
    output: {
      filename: `${baseName}.min.js`,
      path: path.resolve(__dirname, `${outputDir}`),
      library: { name: "Syfr", type: "var" },
      crossOriginLoading: "anonymous",
      clean: {},
    },
    watch,
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
      // new HtmlWebpackPlugin({
      //   filename: "demo.html",
      //   template: "src/template.html",
      //   syfrFormId: dotenv.parsed.SYFR_FORM_ID,
      //   minify: false,
      // }),
      new WebpackAssetsManifest({ integrity: true }),
    ],
  };
};
