import { $SCREEN_TARGET_RECT_ID } from "@/config/ScreenConfig";
import {
    $getTargetRectState,
    $setTargetRectState
} from "../../ScreenUtil";

/**
 * @description 選択範囲のElementを非表示に更新
 *              Update the selected range Element to hidden
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if ($getTargetRectState() === "hide") {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_TARGET_RECT_ID);

    if (!element) {
        return ;
    }

    // 表示状態を更新
    $setTargetRectState("hide");

    // 非表示に更新
    element.setAttribute("style", "display: none;");
};