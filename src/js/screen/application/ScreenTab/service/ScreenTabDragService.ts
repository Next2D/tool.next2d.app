import { $SCREEN_TAB_AREA_ID } from "../../../../config/ScreenConfig";
import {
    $getDragElement,
    $setDragElement
} from "../../ScreenUtil";

/**
 * @description dragイベントの処理関数
 *              Functions for handling drag events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // イベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 初期化
    $setDragElement(null);

    if (!event.currentTarget) {
        return ;
    }

    const element: HTMLElement = event.currentTarget as HTMLElement;

    element
        .classList
        .remove("drop-target");

    const dragElement: HTMLElement | null = $getDragElement();
    if (!dragElement) {
        return ;
    }

    if (element === dragElement) {
        return ;
    }

    const screenTabArea: HTMLElement | null = document
        .getElementById($SCREEN_TAB_AREA_ID);

    if (!screenTabArea) {
        return ;
    }

    const nextElement: Element | null = element.nextElementSibling;

    screenTabArea.insertBefore(
        dragElement,
        dragElement === nextElement
            ? element
            : nextElement
    );
};