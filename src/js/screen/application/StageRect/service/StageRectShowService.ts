import { $SCREEN_STAGE_RECT_ID } from "@/config/ScreenConfig";
import { $getPositon } from "../StageRectUtil";

/**
 * @description 範囲選択をアクティブ表示
 *              Active display of range selection
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number, y: number): void =>
{
    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_RECT_ID);

    if (!element) {
        return ;
    }

    const position = $getPositon();
    position.x = x;
    position.y = y;

    // 表示を更新
    let style = "";
    style += `left: ${x}px;`;
    style += `top: ${y}px;`;
    style += "width: 0px;";
    style += "height: 0px;";
    element.setAttribute("style", style);
};