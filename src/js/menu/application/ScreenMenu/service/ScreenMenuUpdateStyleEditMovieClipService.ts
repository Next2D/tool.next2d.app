import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $SCREEN_CHANGE_SCENE_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
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
        .getElementById($SCREEN_CHANGE_SCENE_ID) as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    if (movie_clip.isSingleSelectedOfDisplayObject()) {

        const layer = movie_clip.getLayer(
            movie_clip.selectedDepths.keys().next().value as number
        );
        if (!layer) {
            return ;
        }

        const values = movie_clip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movie_clip.currentFrame, values[0]);
        if (!character) {
            return ;
        }

        const instance = workSpace.getLibrary(character.libraryId);
        if (!instance) {
            return ;
        }

        if (instance.type === $MOVIE_CLIP_TYPE) {
            element.setAttribute("style", "");
        } else {
            element.style.opacity = "0.5";
            element.style.pointerEvents = "none";
        }

    } else {
        element.style.opacity = "0.5";
        element.style.pointerEvents = "none";
    }
};