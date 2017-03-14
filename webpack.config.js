module.exports = {
    context: __dirname,
    entry: './src/main.js',
    output: {
        path: __dirname,
        filename: 'app.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
        ]
    }
}
