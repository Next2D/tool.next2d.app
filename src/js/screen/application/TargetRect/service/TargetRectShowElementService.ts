import { $SCREEN_TARGET_RECT_ID } from "@/config/ScreenConfig";
import { $setTargetRectState } from "../../ScreenUtil";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

/**
 * @description 選択範囲のElementの表示を更新
 *              Update the display of the selected range element
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @param  {string} class_name
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    x: number,
    y: number,
    width: number,
    height: number,
    class_name: string
): void => {

    const element: HTMLElement | null = document
        .getElementById($SCREEN_TARGET_RECT_ID);

    if (!element) {
        return ;
    }

    // 表示状態を更新
    $setTargetRectState("show");

    let style = "";
    style += `left: ${$getScreenOffsetLeft() + x - 1}px;`;
    style += `top: ${$getScreenOffsetTop() + y - 1}px;`;
    style += `width: ${width - 1}px;`;
    style += `height: ${height - 1}px;`;

    // display: noneをstyleで上書き
    element.setAttribute("style", style);
    element.setAttribute("class", class_name);
};