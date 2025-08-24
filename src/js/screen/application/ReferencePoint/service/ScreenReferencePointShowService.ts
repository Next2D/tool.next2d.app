import { $SCREEN_REFERENCE_POINT_ID } from "@/config/ScreenConfig";
import {
    $getReferencePointState,
    $setReferencePointState
} from "../ReferencePointUtil";

/**
 * @description 変形の中心点Elementを表示
 *              Display the center point Element of the transformation
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number, y: number): void =>
{
    if ($getReferencePointState() === "show") {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_REFERENCE_POINT_ID);

    if (!element) {
        return ;
    }

    // 状態を更新
    let style = "";
    style += `left: ${x - 6}px;`;
    style += `top: ${y - 6}px;`;
    element.setAttribute("style", style);

    // 表示状態を更新
    $setReferencePointState("show");
};