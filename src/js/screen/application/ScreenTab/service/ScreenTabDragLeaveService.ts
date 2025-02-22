import { $getDragElement } from "@/screen/application/ScreenUtil";

/**
 * @description dragleaveのイベント処理関数
 *              Event handling functions for dragleave
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // イベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    if ($getDragElement() === element) {
        return ;
    }

    element
        .classList
        .remove("drop-target");
};