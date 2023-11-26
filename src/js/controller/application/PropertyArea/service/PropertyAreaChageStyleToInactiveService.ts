/**
 * @description プロパティエリアを移動可能な状態にする
 *              Make the timeline area movable
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // プロパティエリアのstyleを変更
    element.style.width           = "";
    element.style.height          = "";
    element.style.left            = "";
    element.style.top             = "";
    element.style.zIndex          = "";
    element.style.boxShadow       = "";
    element.style.position        = "";
    element.style.backgroundColor = "";
};