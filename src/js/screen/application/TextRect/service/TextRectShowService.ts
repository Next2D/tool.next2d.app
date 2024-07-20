import { $SCREEN_DRAW_TEXT_ID } from "@/config/ScreenConfig";
import { textRect } from "@/screen/domain/model/TextRect";

/**
 * @description 範囲選択をアクティブ表示
 *              Active display of range selection
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {string} [radius=""]
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number, y: number): void =>
{
    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_DRAW_TEXT_ID);

    if (!element) {
        return ;
    }

    textRect.x = x;
    textRect.y = y;

    // 表示を更新
    let style = "";
    style += `left: ${x}px;`;
    style += `top: ${y}px;`;
    style += "width: 0px;";
    style += "height: 0px;";

    element.setAttribute("style", style);
};