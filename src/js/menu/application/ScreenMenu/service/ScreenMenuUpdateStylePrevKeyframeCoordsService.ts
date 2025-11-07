import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID } from "@/config/ScreenConfig";

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
    // 単独選択時の表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID) as HTMLElement;
    if (!element) {
        return ;
    }

    // 選択しているDisplayObjectがある場合はボタンをアクティブにする
    if (movie_clip.selectedDepths.size > 0) {
        element.setAttribute("style", "");
    } else {
        element.style.opacity = "0.5";
        element.style.pointerEvents = "none";
    }
};