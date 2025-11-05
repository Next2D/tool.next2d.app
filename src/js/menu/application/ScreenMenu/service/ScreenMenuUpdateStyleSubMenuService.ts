import type { MovieClip } from "@/core/domain/model/MovieClip";
import {
    $SCREEN_ALIGN_ID,
    $SCREEN_ORDER_ID
} from "@/config/ScreenConfig";

/**
 * @description サブメニューボタンのスタイルを更新
 *              Update the style of the submenu button
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const ids = [
        $SCREEN_ALIGN_ID,
        $SCREEN_ORDER_ID
    ];

    const isSingleSelectedOfDisplayObject = movie_clip.isSingleSelectedOfDisplayObject();
    for (let idx = 0; idx < ids.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(ids[idx]) as HTMLElement;

        if (!element) {
            continue ;
        }

        if (isSingleSelectedOfDisplayObject) {
            element.setAttribute("style", "");
        } else {
            element.style.opacity = "0.5";
            element.style.pointerEvents = "none";
        }
    }
};