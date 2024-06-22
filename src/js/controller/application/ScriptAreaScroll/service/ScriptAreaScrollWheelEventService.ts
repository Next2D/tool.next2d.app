import {
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID
} from "@/config/ControllerScriptAreaConfig";
import { scriptArea } from "@/controller/domain/model/ScriptArea";

/**
 * @description JSエリアのホイールイベント
 *             Wheel event of the JS area
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
            .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID);

        if (!listElement) {
            return ;
        }

        const scrollBarElement: HTMLElement | null = document
            .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID);

        if (!scrollBarElement) {
            return ;
        }

        listElement.scrollTop += event.deltaY;
        scrollBarElement.style.top = `${listElement.scrollTop * scriptArea.scrollScale}px`;
    });
};