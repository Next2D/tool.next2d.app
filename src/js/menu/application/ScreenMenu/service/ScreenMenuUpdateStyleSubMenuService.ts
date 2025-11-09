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
    // 順序ボタンのスタイルを更新
    const screenOrderElement = document.getElementById($SCREEN_ORDER_ID);
    if (screenOrderElement) {
        // 選択中のElementが1つの場合はアクティブにする
        if (movie_clip.isSingleSelectedOfDisplayObject()) {
            screenOrderElement.setAttribute("style", "");
        } else {
            screenOrderElement.style.opacity = "0.5";
            screenOrderElement.style.pointerEvents = "none";
        }
    }

    // 整列ボタンのスタイルを更新
    const screenAlignElement = document.getElementById($SCREEN_ALIGN_ID);
    if (screenAlignElement) {
        // 選択中のElementが無い場合は非アクティブにする
        if (!movie_clip.selectedDepths.size) {
            screenAlignElement.style.opacity = "0.5";
            screenAlignElement.style.pointerEvents = "none";
        } else {
            screenAlignElement.setAttribute("style", "");
        }
    }
};