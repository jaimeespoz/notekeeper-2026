const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dotenv = require("dotenv").config({ path: "./.env" });

const devMode = process.env.NODE_ENV !== "production";
const isProductionMode = process.env.NODE_ENV === "production";
const buildPath = path.resolve(__dirname, "dist");

const babelConfig = [
   {
      loader: "babel-loader",
      options: {
         cacheDirectory: true,
         comments: false,
         presets: ["@babel/preset-env"],
      },
   },
];

module.exports = {
   mode: process.env.NODE_ENV,
   entry: {
      index: "./src/js/app.js",
   },

   resolve: {
      modules: [
         "node_modules", // The default
         "src",
      ],
   },

   devtool: "inline-source-map",

   devServer: {
      static: {
         directory: buildPath,
      },
      hot: true,
      compress: true,
      port: 3000,
      open: true,
      historyApiFallback: true,
   },

   plugins: [
      new HtmlWebpackPlugin({
         title: "Development",
         template: "./index.html",
      }),
      new MiniCssExtractPlugin({
         filename: isProductionMode ? "[name].[contenthash].css" : "[name].css",
      }),
   ],

   output: {
      filename: "[name].bundle.js",
      path: buildPath,
      clean: true,
      publicPath: "/",
   },

   module: {
      rules: [
         {
            test: /.(js|jsx)$/i,
            use: babelConfig,
         },

         {
            test: /\.(sa|sc|c)ss$/,
            use: [
               isProductionMode ? MiniCssExtractPlugin.loader : "style-loader",
               {
                  loader: "css-loader",
                  options: { importLoaders: 1 },
               },
               {
                  loader: "postcss-loader",
                  options: {
                     postcssOptions: {
                        plugins: [
                           [
                              "autoprefixer",
                              {
                                 // Options
                              },
                           ],
                        ],
                     },
                  },
               },
               { loader: "sass-loader" },
            ],
         },

         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/resource",
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
         },
      ],
   },

   stats: {
      errorDetails: true,
      warnings: true,
      errors: true,
   },

   cache: {
      type: "memory",
      maxGenerations: Infinity,
   },
};
