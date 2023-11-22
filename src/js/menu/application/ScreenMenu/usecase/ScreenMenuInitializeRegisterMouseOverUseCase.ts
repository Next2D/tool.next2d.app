import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenMenuHideSubMenuService } from "../service/ScreenMenuHideSubMenuService";
import { execute as screenMenuShowSubMenuService } from "../service/ScreenMenuShowSubMenuService";

/**
 * @description スクリーンメニューのマウスオーバー時のイベント登録
 *              Event registration on mouse-over of screen menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // サブメニュー対象外のElelmentIdの配列
    const hideElementIds: string[] = [
        "screen-distribute-to-layers",
        "screen-distribute-to-keyframes",
        "screen-align-coordinates-prev-keyframe",
        "screen-align-matrix-prev-keyframe",
        "screen-integrating-paths",
        "screen-add-tween-curve-pointer",
        "screen-delete-tween-curve-pointer",
        "screen-change-movie-clip",
        "screen-preview",
        "screen-ruler",
        "screen-change-scene",
        "screen-move-scene"
    ];

    // 対象外のElelmentの場合は、サブメニューを非表示にする
    for (let idx: number = 0; idx < hideElementIds.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(hideElementIds[idx]);

        if (!element) {
            continue;
        }

        element.addEventListener(EventType.MOUSE_OVER, screenMenuHideSubMenuService);
    }

    // サブメニュー対象のElelmentIdの配列
    const showElementIds = [
        "screen-order",
        "screen-align"
    ];

    // 対象のElelmentの場合は、サブメニューを表示にする
    for (let idx: number = 0; idx < showElementIds.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(showElementIds[idx]);

        if (!element) {
            continue;
        }

        element.addEventListener(EventType.MOUSE_OVER, screenMenuShowSubMenuService);
    }
};