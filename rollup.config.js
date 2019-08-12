const resolve = require('rollup-plugin-node-resolve');

export default {
    input: './src/lightning.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning' ]
    })],
    output: {
        file: './dist/lightning-spark.mjs',
        format: 'esm',
        name: 'lng'
    }
};
