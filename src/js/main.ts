import "../css/style.scss";
import "@next2d/player";
import {
    initialize,
    boot,
    run
} from "@/Application";

/**
 * @description 起動実行関数
 *              invocation function
 *
 * @return {Promise<void>}
 * @method
 * @private
 */
const execute = async (): Promise<void> =>
{
    window.removeEventListener("DOMContentLoaded", execute);

    await initialize();
    await boot();
    await run();
};

if (document.readyState === "loading") {

    window.addEventListener("DOMContentLoaded", execute);

} else {

    execute();

}