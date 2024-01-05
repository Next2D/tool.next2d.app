import "../css/style.scss";

import "@next2d/player";
import { initialize, boot, run } from "@/Application";

/**
 * @description 起動実行関数
 *              invocation function
 *
 * @return {void}
 * @method
 * @private
 */
const execute = (): void =>
{
    window.removeEventListener("DOMContentLoaded", execute);

    initialize()
        .then(boot)
        .then(run);
};

if (document.readyState === "loading") {

    window.addEventListener("DOMContentLoaded", execute);

} else {

    execute();

}