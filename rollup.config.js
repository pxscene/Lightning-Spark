const resolve = require('rollup-plugin-node-resolve');

export default [{
    input: './src/lightning.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning' ]
    })],
    output: {
        file: './dist/lightning-spark.js',
        format: 'cjs',
        name: 'lng'
    }
}, {
    input: './src/platforms/spark/SparkPlatform.mjs',
    output: {
        file: './dist/SparkPlatform.js',
        format: 'iife',
        name: 'SparkPlatform',
        interop: false
    }
}];