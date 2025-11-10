import { $SCREEN_CONVERT_MOVIE_CLIP_ID } from "@/config/ScreenConfig";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description スクリーンのメニューを選択中のElementに合わせてアクティブ・非アクティブに更新する
 *              Update the screen menu to be active/inactive according to the selected Element
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    // 単独選択時の表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_CONVERT_MOVIE_CLIP_ID) as HTMLElement;
    if (!element) {
        return ;
    }

    // 選択可能なのは1レイヤー内のDisplayObjectが対象
    if (movie_clip.selectedDepths.size === 1) {
        element.setAttribute("style", "");
    } else {
        element.style.opacity = "0.5";
        element.style.pointerEvents = "none";
    }
};