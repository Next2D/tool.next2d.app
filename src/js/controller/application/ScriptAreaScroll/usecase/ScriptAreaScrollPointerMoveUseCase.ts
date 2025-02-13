import { $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID } from "@/config/ControllerScriptAreaConfig";
import { scriptArea } from "@/controller/domain/model/ScriptArea";

/**
 * @description JSエリアのスクロールバーのマウスムーブイベント
 *              Mouse move event of the JS area scroll bar
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
        const listAreaElement: HTMLElement | null = document
            .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID);

        if (!listAreaElement) {
            return ;
        }

        const element: HTMLElement | null = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        listAreaElement.scrollTop += event.movementY / scriptArea.scrollScale;
        element.style.top = `${listAreaElement.scrollTop * scriptArea.scrollScale}px`;
    });
};