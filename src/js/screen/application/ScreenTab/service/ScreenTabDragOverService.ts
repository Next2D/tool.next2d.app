import { $getDragElement } from "@/screen/application/ScreenUtil";

/**
 * @description dragoverのイベント処理関数
 *              Event processing functions for dragover
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

    if (element.classList.contains("drop-targe")) {
        return ;
    }

    element
        .classList
        .add("drop-target");
};