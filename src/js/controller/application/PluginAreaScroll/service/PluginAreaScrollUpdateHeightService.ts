import { $PLUGIN_LIST_BOX_BODY_ID, $PLUGIN_LIST_SCROLL_AREA_ID, $PLUGIN_LIST_SCROLL_BAR_ID } from "@/config/PluginAreaConfig";
import { pluginArea } from "@/controller/domain/model/PluginArea";

/**
 * @description プラグインエリアのスクロールバーの高さを更新する
 *              Update the height of the scrollbar in the plugin area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const scrollAreaElement: HTMLElement | null = document
        .getElementById($PLUGIN_LIST_SCROLL_AREA_ID);

    if (!scrollAreaElement) {
        return ;
    }

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

    // スクロールバーの幅を算出
    pluginArea.scrollScale = scrollAreaElement.clientHeight / listElement.scrollHeight;
    if (1 > pluginArea.scrollScale) {

        scrollBarElement.style.display = "";
        scrollBarElement.style.top = `${Math.floor(listElement.scrollTop * pluginArea.scrollScale)}px`;

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--plugin-scroll-bar-height",
                `${Math.floor(listElement.clientHeight * pluginArea.scrollScale) - 2}px`
            );

    } else {

        scrollBarElement.style.display = "none";

    }
};