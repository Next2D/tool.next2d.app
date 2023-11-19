import "../css/style.scss";

import { initialize, boot, run } from "@/Application";

/**
 * @description 起動実行関数
 *              invocation function
 *
 * @param  {Event} [event=null]
 * @return {void}
 * @method
 * @private
 */
const execute = (event: Event | null = null): void =>
{
    if (event && event.target) {
        event.target.removeEventListener("DOMContentLoaded", execute);
    }

    initialize()
        .then(boot)
        .then(run);
};

if (document.readyState === "loading") {

    window.addEventListener("DOMContentLoaded", execute);

} else {

    execute();

}