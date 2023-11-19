import "../css/style.scss";

import { initialize, run } from "@/Application";

if (document.readyState === "loading") {

    const wait = (event: Event): void =>
    {
        if (!event.target) {
            return ;
        }

        event.target.removeEventListener("DOMContentLoaded", wait);

        initialize().then(run);
    };

    window.addEventListener("DOMContentLoaded", wait);

} else {

    initialize().then(run);

}