import {
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_AREA_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID
} from "@/config/ControllerScriptAreaConfig";
import { scriptArea } from "@/controller/domain/model/ScriptArea";

/**
 * @description JSエリアのスクロールバーの高さを更新する
 *              Update the height of the history area scroll bar
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const scrollAreaElement: HTMLElement | null = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_AREA_ID);

    if (!scrollAreaElement) {
        return ;
    }

    const listElement: HTMLElement | null = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID);

    if (!listElement) {
        return ;
    }

    const scrollBarElement: HTMLElement | null = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID);

    if (!scrollBarElement) {
        return ;
    }

    // スクロールバーの幅を算出
    scriptArea.scrollScale = scrollAreaElement.clientHeight / listElement.scrollHeight;
    if (1 > scriptArea.scrollScale) {

        scrollBarElement.style.display = "";
        scrollBarElement.style.top = `${Math.floor(listElement.scrollTop * scriptArea.scrollScale)}px`;

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--javascript-scroll-bar-height",
                `${Math.floor(listElement.clientHeight * scriptArea.scrollScale) - 2}px`
            );

    } else {

        scrollBarElement.style.display = "none";

    }
};