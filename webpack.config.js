const pck = require('./package.json');

module.exports = {
    entry: ['./src/index.ts'],
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    output: {
        path: __dirname,
        filename: `./${pck.name}.min.js`,
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};