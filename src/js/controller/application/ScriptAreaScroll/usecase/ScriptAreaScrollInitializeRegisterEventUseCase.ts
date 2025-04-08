import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptAreaScrollMouseDownUseCase } from "./ScriptAreaScrollPointerDownUseCase";
import { execute as scriptAreaScrollWheelEventService } from "../service/ScriptAreaScrollWheelEventService";
import {
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID
} from "@/config/ControllerScriptAreaConfig";

/**
 * @description JSエリアのスクロールイベントを登録
 *              Register the scroll event of the JS area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scrollBarElement: HTMLElement | null = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID);

    // マウスダウンイベントを登録
    if (scrollBarElement) {
        scrollBarElement.addEventListener(EventType.POINTER_DOWN,
            scriptAreaScrollMouseDownUseCase
        );
    }

    const listElement: HTMLElement | null = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID);

    if (listElement) {
        listElement.addEventListener("wheel",
            scriptAreaScrollWheelEventService,
            { "passive": false }
        );
    }
};