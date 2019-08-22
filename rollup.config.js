const resolve = require('rollup-plugin-node-resolve');

export default {
    input: './src/lightning-platform-spark.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning' ]
    })],
    output: {
        file: './dist/lightning-spark.js',
        format: 'cjs',
        name: 'lng'
    }
};