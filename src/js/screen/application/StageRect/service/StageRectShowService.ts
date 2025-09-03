import { $SCREEN_STAGE_RECT_ID } from "@/config/ScreenConfig";
import { stageRect } from "@/screen/domain/model/StageRect";

/**
 * @description 範囲選択をアクティブ表示
 *              Active display of range selection
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} offset_x
 * @param  {number} offset_y
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    x: number,
    y: number,
    offset_x: number,
    offset_y: number
): void => {

    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_RECT_ID);

    if (!element) {
        return ;
    }

    stageRect.x = x;
    stageRect.y = y;
    stageRect.offsetX = offset_x;
    stageRect.offsetY = offset_y;

    // 表示を更新
    let style = "";
    style += `left: ${offset_x + x}px;`;
    style += `top: ${offset_y + y}px;`;
    style += "width: 0px;";
    style += "height: 0px;";
    element.setAttribute("style", style);
};