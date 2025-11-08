import type { MovieClip } from "@/core/domain/model/MovieClip";
import {
    $SCREEN_ALIGN_COORDINATES_NEXT_KEYFRAME_ID,
    $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
    $SCREEN_ALIGN_MATRIX_NEXT_KEYFRAME_ID,
    $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID
} from "@/config/ScreenConfig";

/**
 * @description スクリーンのメニューを選択中のElementに合わせてアクティブ・非アクティブに更新する
 *              Update the screen menu to be active/inactive according to the selected Element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const ids = [
        $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
        $SCREEN_ALIGN_COORDINATES_NEXT_KEYFRAME_ID,
        $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
        $SCREEN_ALIGN_MATRIX_NEXT_KEYFRAME_ID
    ];

    const show = movie_clip.selectedDepths.size > 0;
    for (let idx = 0; idx < ids.length; idx++) {

        // 単独選択時の表示
        const element: HTMLElement | null = document
            .getElementById(ids[idx]) as HTMLElement;

        if (!element) {
            continue;
        }

        // 選択しているDisplayObjectがある場合はボタンをアクティブにする
        if (show) {
            element.setAttribute("style", "");
        } else {
            element.style.opacity = "0.5";
            element.style.pointerEvents = "none";
        }
    }
};