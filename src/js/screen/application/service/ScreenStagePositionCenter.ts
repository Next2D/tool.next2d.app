import type { Stage } from "../../../core/model/Stage";

/**
 * @description ステージの背後のレイヤーのサイズを更新
 *              Update the size of the layer behind the stage
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (stage: Stage): void =>
{
    const element: HTMLElement | null = document
        .getElementById("screen");

    if (!element) {
        return ;
    }

    element.scrollLeft = window.screen.width  / 2 - (element.clientWidth  - stage.width)  / 2;
    element.scrollTop  = window.screen.height / 2 - (element.clientHeight - stage.height) / 2;
};