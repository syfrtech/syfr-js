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
  let outputDir = env.production ? `public` : ".cache";
  let watch = !env.production;
  let baseName = "form-cipher";
  let plugins = [
    new WebpackAssetsManifest({
      integrity: true,
      output: `${env.production ? `${version}/` : ""}assets-manifest.json`,
      publicPath: `https://js.syfr.app/`,
      customize(entry, original, manifest, asset) {
        // You can prevent adding items to the manifest by returning false.
        // see https://github.com/webdeveric/webpack-assets-manifest/blob/master/examples/customized.js
        if (
          entry.key.endsWith(".ts") ||
          entry.key.endsWith(".map") ||
          entry.key.endsWith(".html") ||
          entry.key === "main.js"
        ) {
          return false;
        }
      },
    }),
  ];
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
      [`${baseName}`]: {
        import: path.resolve(__dirname, "src/autodetect.ts"),
      },
      [`${baseName}-manual`]: {
        import: path.resolve(__dirname, "src/class.ts"),
      },
    },
    output: {
      filename: `${env.production ? `${version}/[name].min` : "[name]"}.js`,
      path: path.resolve(__dirname, `${outputDir}`),
      library: { name: "Syfr", type: "var" },
      crossOriginLoading: "anonymous",
      clean: env.production ? false : true,
    },
    watch,
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
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
