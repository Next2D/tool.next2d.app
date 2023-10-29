/**
 * @description タイムラインエリアを移動可能な状態にする
 *              Make the timeline area movable
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // ツールエリアのstyleを変更
    element.style.width     = `${element.clientWidth}px`;
    element.style.minWidth  = "860px";
    element.style.left      = `${element.offsetLeft}px`;
    element.style.top       = `${element.offsetTop}px`;
    element.style.zIndex    = `${0xffffff}`;
    element.style.boxShadow = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position  = "fixed"; // fixed logic

    // タイムラインエリアの高さを0にしてscreenの幅を広くする
    document
        .documentElement
        .style
        .setProperty("--timeline-logic-height", "0px");
};