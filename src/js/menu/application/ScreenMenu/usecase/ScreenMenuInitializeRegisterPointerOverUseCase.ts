import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenMenuHideSubMenuService } from "../service/ScreenMenuHideSubMenuService";
import { execute as screenMenuShowSubMenuService } from "../service/ScreenMenuShowSubMenuService";
import {
    $SCREEN_ALIGN_ID,
    $SCREEN_ORDER_ID,
    $SCREEN_DISTRIBUTE_TO_LAYERS_ID,
    $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID,
    $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
    $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
    $SCREEN_INTEGRATING_PATHS_ID,
    $SCREEN_ADD_TWEEN_CURVE_POINTER_ID,
    $SCREEN_DELETE_TWEEN_CURVE_POINTER_ID,
    $SCREEN_CONVERT_MOVIE_CLIP_ID,
    $SCREEN_PREVIEW_ID,
    $SCREEN_CHANGE_SCENE_ID,
    $SCREEN_MOVE_SCENE_ID,
    $SCREEN_RULER_ID
} from "@/config/ScreenConfig";

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
    const hideElementIds = [
        $SCREEN_DISTRIBUTE_TO_LAYERS_ID,
        $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID,
        $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
        $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
        $SCREEN_INTEGRATING_PATHS_ID,
        $SCREEN_ADD_TWEEN_CURVE_POINTER_ID,
        $SCREEN_DELETE_TWEEN_CURVE_POINTER_ID,
        $SCREEN_CONVERT_MOVIE_CLIP_ID,
        $SCREEN_PREVIEW_ID,
        $SCREEN_RULER_ID,
        $SCREEN_CHANGE_SCENE_ID,
        $SCREEN_MOVE_SCENE_ID
    ];

    // 対象外のElelmentの場合は、サブメニューを非表示にする
    for (let idx = 0; idx < hideElementIds.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(hideElementIds[idx]);

        if (!element) {
            continue;
        }

        element.addEventListener(EventType.POINTER_OVER,
            screenMenuHideSubMenuService
        );
    }

    // サブメニュー対象のElelmentIdの配列
    const showElementIds = [
        $SCREEN_ORDER_ID,
        $SCREEN_ALIGN_ID
    ];

    // 対象のElelmentの場合は、サブメニューを表示にする
    for (let idx = 0; idx < showElementIds.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(showElementIds[idx]);

        if (!element) {
            continue;
        }

        element.addEventListener(EventType.POINTER_OVER,
            screenMenuShowSubMenuService
        );
    }
};