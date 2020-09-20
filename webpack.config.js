const HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  autoprefixer = require('autoprefixer'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  entry: {
    main: './src/index.js',
    checkout: './src/checkout.js',
    orderPlace: './src/orderPlaced.js',
    statics: './src/statics.js'
    /* maps: './src/maps.js' */
    //otro:'./src/hello_vanilla.js'
  },
  output: {
    filename: 'js/[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: false
        }
      }]
    },
    {
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',

        },
        {
          loader: 'postcss-loader',
          options: {
            autoprefixer: {
              browser: ['last 2 versions']
            },

            sourceMap: true,
            plugins: () => [autoprefixer]
          }
        },
        'resolve-url-loader', // requiere sourcemap en sass
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'compressed',
            sourceMap: true

          },
        }

      ],
      test: /\.(css|scss)$/
    },
    {
      test: /\.(jpe?g|png|gif|webp)$/i,
      use: [
        'file-loader?name=assets/[name].[ext]',
        'image-webpack-loader?bypassOnDebug'
      ]
    },
    {
      test: /\.(ttf|eot|woff2?|mp4|mp3|txt|xml|pdf)$/i,
      use: 'file-loader?name=assets/[name].[ext]'
    },
    {
      test: /\.(svg)/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
    }


    ]
  },
  devServer: {
    disableHostCheck: true,
    // other options
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default'],
        }
      })
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist/js/*.*', 'dist/js/*.*']),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/greensock.html',
      filename: 'greensock.html',
      chunks: ['main']
    })


  ]
}