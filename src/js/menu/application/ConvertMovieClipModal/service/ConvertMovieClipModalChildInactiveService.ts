import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";

/**
 * @description ConvertMovieClipModalの子要素のactiveクラスを全て削除する
 *              Remove the active class from all child elements of ConvertMovieClipModal
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element = document
        .getElementById($CONVERT_MOVIE_CLIP_MODAL_NAME);

    if (!element) {
        return;
    }

    // 全ての子要素のactiveクラスを削除する
    const elements = element
        .querySelectorAll(".convert-movie-clip-box-child");

    const length = elements.length;
    for (let idx = 0; idx < length; idx++) {

        const node = elements[idx];
        if (!node) {
            continue;
        }

        node.classList.remove("active");
    }
};