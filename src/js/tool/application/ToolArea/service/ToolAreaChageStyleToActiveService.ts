import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    const workSpace = $getCurrentWorkSpace();
    const toolAreaState = workSpace.toolAreaState;

    // ツールエリアのstyleを変更
    if (toolAreaState.state === "fixed") {
        return ;
    }

    element.style.height    = "96vh";
    element.style.left      = `${toolAreaState.offsetLeft}px`;
    element.style.top       = `${toolAreaState.offsetTop}px`;
    element.style.zIndex    = `${0xffff}`;
    element.style.boxShadow = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position  = "fixed"; // fixed logic

    // ツールエリアの幅を0にしてscreenの幅を広くする
    document
        .documentElement
        .style
        .setProperty("--tool-width", "0px");
};