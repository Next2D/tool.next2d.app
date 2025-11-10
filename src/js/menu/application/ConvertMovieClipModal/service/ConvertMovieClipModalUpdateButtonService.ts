import { $CONVERT_MOVIE_CLIP_BUTTON_ID } from "@/config/ConvertMovieClipConfig";
import { $canProceed } from "../ConvertMovieClipModalUtil";

/**
 * @description ConvertMovieClipModalの変換ボタンの状態を更新
 *              Update the state of the convert button in ConvertMovieClipModal
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONVERT_MOVIE_CLIP_BUTTON_ID);

    if (!element) {
        return;
    }

    if ($canProceed()) {
        element.style.pointerEvents = "auto";
        element.style.opacity       = "1";
    } else {
        element.setAttribute("style", "");
    }
};