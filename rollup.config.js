const resolve = require('rollup-plugin-node-resolve');

export default {
    input: './src/lightning-platform-spark.mjs',
    output: {
        file: './dist/lightning-spark.js',
        format: 'cjs',
        name: 'lng'
    }
};