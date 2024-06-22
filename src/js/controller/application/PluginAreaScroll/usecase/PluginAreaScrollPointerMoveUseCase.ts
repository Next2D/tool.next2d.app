import { $PLUGIN_LIST_BOX_BODY_ID } from "@/config/PluginAreaConfig";
import { pluginArea } from "@/controller/domain/model/PluginArea";

/**
 * @description プラグインエリアのスクロールバーのマウスムーブイベント
 *              Plugin area scrollbar mouse move event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    if (!event.movementY) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const listElement: HTMLElement | null = document
            .getElementById($PLUGIN_LIST_BOX_BODY_ID);

        if (!listElement) {
            return ;
        }

        const element: HTMLElement | null = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        listElement.scrollTop += event.movementY;
        element.style.top = `${listElement.scrollTop * pluginArea.scrollScale}px`;
    });
};