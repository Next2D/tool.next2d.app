import { $SCREEN_STANDARD_POINT_ID } from "@/config/ScreenConfig";
import {
    $getStandardPointState,
    $setStandardPointState
} from "../StandardPointUtil";

/**
 * @description 標準点Elementを非表示
 *              Hide the standard point Element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if ($getStandardPointState() === "hide") {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STANDARD_POINT_ID);

    if (!element) {
        return ;
    }

    // 非表示に更新
    element.setAttribute("style", "display: none;");

    // 状態を更新
    $setStandardPointState("hide");
};