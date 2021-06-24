import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const BUILD_PATH = path.resolve(__dirname, '../../build');

const BACKGROUND_PATH = path.resolve(__dirname, '../../src/background.ts');
const CONTENT_PATH = path.resolve(__dirname, '../../src/content.ts');
const POPUP_PATH = path.resolve(__dirname, '../../src/popup.ts');

export const config = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        background: BACKGROUND_PATH,
        content: CONTENT_PATH,
        popup: POPUP_PATH,
    },
    output: {
        path: path.join(BUILD_PATH),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: 'src',
                    from: 'images',
                    to: 'images',
                },
                {
                    context: 'src',
                    from: '_locales',
                    to: '_locales',
                },
                {
                    context: 'src',
                    from: 'manifest.json',
                    to: 'manifest.json',
                },
                // TODO update build to generate this files
                {
                    context: 'src',
                    from: 'popup.css',
                    to: 'popup.css',
                },
                {
                    context: 'src',
                    from: 'popup.html',
                    to: 'popup.html',
                },
            ],
        }),
    ],
};
