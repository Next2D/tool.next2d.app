import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description スクリプトアイコンのマウスダウンイベントの実行関数
 *              Execution function of the mouse down event of the script icon
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const parentElement = element.parentElement;
    if (!parentElement) {
        return ;
    }

    // スクリプトがなければ終了
    const frame = parseInt(parentElement.dataset.frame as string);
    const scene = $getCurrentWorkSpace().scene;
    if (!scene.hasAction(frame)) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    element.draggable = true;
};