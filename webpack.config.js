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
  let plugins = [new WebpackAssetsManifest({ integrity: true })];
  if (env.development) {
    plugins.push(
      new HtmlWebpackPlugin({
        filename: "demo.html",
        template: "src/template.html",
        syfrFormId: dotenv.parsed.SYFR_FORM_ID,
        minify: false,
      })
    );
  }
  return {
    mode: env.production ? "production" : "development",
    devtool: env.production ? "source-map" : undefined,
    entry: {
      [`${baseName}.min`]: path.resolve(__dirname, "src/autodetect.ts"),
      [`${baseName}-react`]: {
        filename: `${baseName}-react${env.production ? ".min" : ""}.js`,
        import: path.resolve(__dirname, "src/react.ts"),
      },
      [`${baseName}-manual`]: {
        filename: `${baseName}-manual${env.production ? ".min" : ""}.js`,
        import: path.resolve(__dirname, "src/class.ts"),
      },
      [`main`]: {
        filename: `main.js`,
        import: path.resolve(__dirname, "src/index.ts"),
      },
    },
    output: {
      filename: `${baseName}${env.production ? ".min" : ""}.js`,
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
    plugins,
  };
};
