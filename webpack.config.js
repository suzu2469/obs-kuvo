const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/client/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlPlugin({
            template: 'src/client/index.html'
        })
    ]
}
