import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 現在のポインター位置以上の履歴を削除
 *              Delete history above the current pointer position
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    const length = movie_clip.histories.length;
    if (movie_clip.historyIndex === length) {
        return ;
    }

    for (let idx = movie_clip.historyIndex; idx < length; ++idx) {

        const node: HTMLElement | undefined = element.lastElementChild as HTMLElement;
        if (!node) {
            continue;
        }

        node.remove();
    }
};