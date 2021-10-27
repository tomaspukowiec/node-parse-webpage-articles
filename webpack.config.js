const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './dist/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    externals: [nodeExternals(), 'bufferutil', 'utf-8-validate'],
    target: 'node'
};
