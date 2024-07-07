import { $SCREEN_STANDARD_POINT_ID } from "@/config/ScreenConfig";
import { $getStandardPointState, $setStandardPointState } from "../StandardPointUtil";

/**
 * @description 標準点Elementを表示
 *              Display the standard point Element
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number, y: number): void =>
{
    if ($getStandardPointState() === "show") {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STANDARD_POINT_ID);

    if (!element) {
        return ;
    }

    let style = "";
    style += `left: ${x - 6}px;`;
    style += `top: ${y - 6}px;`;
    element.setAttribute("style", style);

    // 状態を更新
    $setStandardPointState("show");
};