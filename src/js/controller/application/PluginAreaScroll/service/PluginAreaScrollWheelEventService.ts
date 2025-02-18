import { pluginArea } from "@/controller/domain/model/PluginArea";
import {
    $PLUGIN_LIST_BOX_BODY_ID,
    $PLUGIN_LIST_SCROLL_BAR_ID
} from "@/config/PluginAreaConfig";

/**
 * @description プラグインエリアのホイールイベント
 *              Plugin area wheel event
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const listElement: HTMLElement | null = document
            .getElementById($PLUGIN_LIST_BOX_BODY_ID);

        if (!listElement) {
            return ;
        }

        const scrollBarElement: HTMLElement | null = document
            .getElementById($PLUGIN_LIST_SCROLL_BAR_ID);

        if (!scrollBarElement) {
            return ;
        }

        listElement.scrollTop += event.deltaY;
        scrollBarElement.style.top = `${listElement.scrollTop * pluginArea.scrollScale}px`;
    });
};