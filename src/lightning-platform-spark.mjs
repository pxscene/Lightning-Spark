import SparkPlatform from "./platforms/spark/SparkPlatform.mjs"

const lightningPlatform = SparkPlatform;

//export default lightningPlatform;

global.LIGHTNING_PLATFORM = lightningPlatform;