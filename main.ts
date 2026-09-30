import { definePlugin } from "yinz:plugin";
let greeting = "";
export default definePlugin({
  load(config) {
    greeting = config["greeting"] ?? "";
  },
  render() {
    return "hello v2 " + greeting;
  },
});
