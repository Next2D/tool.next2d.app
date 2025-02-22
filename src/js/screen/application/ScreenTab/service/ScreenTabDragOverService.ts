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

    if (element.classList.contains("drop-targe")) {
        return ;
    }

    element
        .classList
        .add("drop-target");
};