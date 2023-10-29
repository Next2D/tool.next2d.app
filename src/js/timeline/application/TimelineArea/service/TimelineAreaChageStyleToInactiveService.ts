/**
 * @description タイムラインエリアを初期位置に戻す
 *              Restore the timeline area to its initial position
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // ツールエリアを初期値に移動
    element.style.width     = "";
    element.style.minWidth  = "";
    element.style.left      = "";
    element.style.top       = "";
    element.style.zIndex    = "";
    element.style.boxShadow = "";
    element.style.position  = "";

    const timelineHeight: string = document
        .documentElement
        .style
        .getPropertyValue("--timeline-height");

    // ツールエリアの幅を元に戻す
    document
        .documentElement
        .style
        .setProperty("--timeline-logic-height", timelineHeight);
};