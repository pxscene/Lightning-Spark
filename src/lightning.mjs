import lng from "wpe-lightning/src/lightning.mjs";
import SparkPlatform from "./platforms/spark/SparkPlatform.mjs"
import TextTextureRendererSpark from "./platforms/spark/TextTextureRendererSpark.mjs"

const lightning = lng;
const sparkTextTextureRenderer = TextTextureRendererSpark;

lightning.Stage.platform = SparkPlatform;

export default lightning;
export default sparkTextTextureRenderer;