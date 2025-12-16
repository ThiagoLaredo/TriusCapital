const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/js/script.js',
    ouvidoria: './src/js/ouvidoria.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    // Adicionar para evitar duplicação de módulos compartilhados
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',  // Isso gerará main.css e ouvidoria.css
    }),
    // Para index.html (main)
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main', 'vendors'], // Carrega main.js e vendors.js
      minify: {
        removeRedundantAttributes: false,
      },
    }),
    // Para ouvidoria.html
    new HtmlWebpackPlugin({
      template: './src/ouvidoria.html',
      filename: 'ouvidoria.html',
      chunks: ['ouvidoria', 'vendors'], // Carrega ouvidoria.js e vendors.js
      minify: {
        removeRedundantAttributes: false,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/img', to: 'img' },
        { from: 'src/translations.json', to: 'translations.json' },
      ]
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  mode: 'production',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true,
    hot: true,
    proxy: [{  
      context: () => true,
      target: 'http://localhost:5005',
      secure: false,
      changeOrigin: true,
      timeout: 120000
    }]
  }
};