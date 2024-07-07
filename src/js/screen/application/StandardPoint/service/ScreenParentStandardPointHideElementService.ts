import { $SCREEN_PARENT_STANDARD_POINT_ID } from "@/config/ScreenConfig";
import { $getParentStandardPointState, $setParentStandardPointState } from "../StandardPointUtil";

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
    if ($getParentStandardPointState() === "hide") {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_PARENT_STANDARD_POINT_ID);

    if (!element) {
        return ;
    }

    // 非表示に更新
    element.setAttribute("style", "display: none;");

    // 状態を更新
    $setParentStandardPointState("hide");
};