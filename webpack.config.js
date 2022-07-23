const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/, //처리해야 할 파일 패턴
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ], //순서는 뒤에서 부터 앞 순서로 적용
      },
      //import 해서 사용할 경우.
      {
        test: /\.(png|jpg|gif|svg)$/i, //처리해야 할 파일 패턴
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        //절대경로로 지정.
        exclude: [path.resolve(__dirname, "./node_modules")],
      },
      /**
       * TODO: babel-loader를 구성해 보세요.
       */
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `빌드 날짜: ${new Date().toLocaleString()}`,
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true, // 주석 제거
            }
          : false,
      hash: process.env.NODE_ENV === "production",
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
};
