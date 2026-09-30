import { definePlugin } from "yinz:plugin";
import { version } from "../shared.ts";
let greeting = "";
export default definePlugin({
  load(config) {
    greeting = config["greeting"] ?? "";
  },
  render() {
    return "nested " + version + " " + greeting;
  },
});
