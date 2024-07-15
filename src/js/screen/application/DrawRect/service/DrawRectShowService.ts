import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { drawRect } from "@/screen/domain/model/DrawRect";
import { fillColor } from "@/tool/domain/model/FillColor";
import { strokeColor } from "@/tool/domain/model/StrokeColor";
import { strokeSize } from "@/tool/domain/model/StrokeSize";

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
export const execute = (x: number, y: number, radius: string = ""): void =>
{
    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_DRAW_RECT_ID);

    if (!element) {
        return ;
    }

    drawRect.x = x;
    drawRect.y = y;

    // 表示を更新
    let style = "";
    style += `left: ${x}px;`;
    style += `top: ${y}px;`;
    style += "width: 0px;";
    style += "height: 0px;";
    style += `background: ${fillColor.value};`;

    if (radius) {
        style += `border-radius: ${radius};`;
    }

    if (strokeSize.value) {
        const workSpace = $getCurrentWorkSpace();
        style += `border: ${strokeSize.value * workSpace.scale}px solid ${strokeColor.value};`;
    }

    element.setAttribute("style", style);
};