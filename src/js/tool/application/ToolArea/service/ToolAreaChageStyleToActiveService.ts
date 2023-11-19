/**
 * @description ツールエリアを移動可能な状態にする
 *              Make the tool area movable
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, left: number = 0, top: number = 0): void =>
{
    // ツールエリアのstyleを変更
    element.style.left      = `${left || element.offsetLeft}px`;
    element.style.top       = `${top || element.offsetTop}px`;
    element.style.zIndex    = `${0xffffff}`;
    element.style.boxShadow = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position  = "fixed"; // fixed logic

    // ツールエリアの幅を0にしてscreenの幅を広くする
    document
        .documentElement
        .style
        .setProperty("--tool-width", "0px");
};