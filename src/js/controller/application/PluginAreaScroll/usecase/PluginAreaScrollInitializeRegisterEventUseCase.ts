import { EventType } from "@/tool/domain/event/EventType";
import { execute as pluginAreaScrollMouseDownUseCase } from "./PluginAreaScrollMouseDownUseCase";
import { execute as pluginAreaScrollWheelEventService } from "../service/PluginAreaScrollWheelEventService";
import {
    $PLUGIN_LIST_BOX_BODY_ID,
    $PLUGIN_LIST_SCROLL_BAR_ID
} from "@/config/PluginAreaConfig";

/**
 * @description プラグインエリアのスクロールイベントを登録
 *              Register the plugin area scroll event
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scrollBarElement: HTMLElement | null = document
        .getElementById($PLUGIN_LIST_SCROLL_BAR_ID);

    // マウスダウンイベントを登録
    if (scrollBarElement) {
        scrollBarElement.addEventListener(EventType.MOUSE_DOWN,
            pluginAreaScrollMouseDownUseCase
        );
    }

    const listElement: HTMLElement | null = document
        .getElementById($PLUGIN_LIST_BOX_BODY_ID);

    if (listElement) {
        listElement.addEventListener("wheel",
            pluginAreaScrollWheelEventService,
            { "passive": false }
        );
    }
};