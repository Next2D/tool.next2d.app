import { $TOOL_AERA_WIDTH } from "../../../../config/ToolConfig";

/**
 * @description ツールエリアを移動可能な状態にする
 *              Make the tool area movable
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // ツールエリアを初期値に移動
    element.style.left      = "";
    element.style.top       = "";
    element.style.zIndex    = "";
    element.style.boxShadow = "";
    element.style.position  = "";

    // ツールエリアの幅を元に戻す
    document
        .documentElement
        .style
        .setProperty("--tool-width", `${$TOOL_AERA_WIDTH}px`);
};