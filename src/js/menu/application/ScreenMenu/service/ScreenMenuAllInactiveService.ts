import {
    $SCREEN_ALIGN_ID,
    $SCREEN_CHANGE_SCENE_ID,
    $SCREEN_ORDER_ID,
    $SCREEN_DISTRIBUTE_TO_LAYERS_ID,
    $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID,
    $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
    $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
    $SCREEN_INTEGRATING_PATHS_ID,
    $SCREEN_ADD_TWEEN_CURVE_POINTER_ID,
    $SCREEN_DELETE_TWEEN_CURVE_POINTER_ID,
    $SCREEN_CHANGE_MOVIE_CLIP_ID
} from "@/config/ScreenConfig";

/**
 * @description スクリーンのメニューの指定IDのElementを全て非アクティブに更新する
 *              Update all Elements of the specified ID in the screen menu to inactive
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const ids = [
        $SCREEN_ALIGN_ID,
        $SCREEN_ORDER_ID,
        $SCREEN_CHANGE_SCENE_ID,
        $SCREEN_DISTRIBUTE_TO_LAYERS_ID,
        $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID,
        $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
        $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
        $SCREEN_INTEGRATING_PATHS_ID,
        $SCREEN_ADD_TWEEN_CURVE_POINTER_ID,
        $SCREEN_DELETE_TWEEN_CURVE_POINTER_ID,
        $SCREEN_CHANGE_MOVIE_CLIP_ID
    ];

    for (let idx = 0; idx < ids.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(ids[idx]) as HTMLElement;

        if (!element) {
            continue ;
        }

        element.style.opacity = "0.5";
        element.style.pointerEvents = "none";
    }
};