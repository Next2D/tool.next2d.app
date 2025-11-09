import { $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID } from "@/config/ScreenConfig";
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
        .getElementById($SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID) as HTMLElement;
    if (!element) {
        return ;
    }

    let show = false;
    for (const depths of movie_clip.selectedDepths.values()) {

        // 単体選択ならスキップ
        if (depths.length === 1) {
            continue;
        }

        // 複数選択なら表示
        show = true;
        break;
    }

    if (show) {
        element.setAttribute("style", "");
    } else {
        element.style.opacity = "0.5";
        element.style.pointerEvents = "none";
    }
};