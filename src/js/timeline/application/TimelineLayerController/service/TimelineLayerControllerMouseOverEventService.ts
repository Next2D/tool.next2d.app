import { $getMoveLayerMode } from "../../TimelineUtil";

/**
 * @description レイヤーコントローラーのマウスオーバー処理関数
 *              Mouse over processing function for the layer controller
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 移動モードでない場合は処理をしない
    if (!$getMoveLayerMode()) {
        return ;
    }

    // 親のイベントを停止
    event.stopPropagation();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const parent = element.parentElement as HTMLElement;
    if (!parent) {
        return ;
    }

    // styleを追加
    parent.classList.add("move-target");
};
