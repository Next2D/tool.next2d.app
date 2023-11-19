import { $getDragElement } from "@/screen/application/ScreenUtil";

/**
 * @description dragleaveのイベント処理関数
 *              Event handling functions for dragleave
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 既定の動作を停止
    event.preventDefault();

    if (!event.currentTarget) {
        return ;
    }

    const element: HTMLElement = event.currentTarget as HTMLElement;
    if ($getDragElement() === element) {
        return ;
    }

    element
        .classList
        .remove("drop-target");
};