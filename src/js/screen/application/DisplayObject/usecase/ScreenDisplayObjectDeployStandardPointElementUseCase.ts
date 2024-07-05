import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $SCREEN_STANDARD_POINT_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";

/**
 * @description MovieClipの標準点Elementを配置
 *              Place the standard point Element of the MovieClip
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のDisplayObjectがなければ終了
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // 複数選択なら終了
    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        return ;
    }

    const layer = movieClip.getLayer(movieClip.selectedDepths.keys().next().value);
    if (!layer) {
        return ;
    }

    const depth = movieClip.selectedDepths.values().next().value[0];
    const character = layer.getCharacter(movieClip.currentFrame, depth);
    if (!character) {
        return ;
    }

    // MovieClipでなければ終了
    const instance: MovieClip = workSpace.getLibrary(character.libraryId);
    if (!instance || instance.type !== $MOVIE_CLIP_TYPE) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STANDARD_POINT_ID);

    if (!element) {
        return ;
    }

    // 親のフレームをセット
    let frame = movieClip.currentFrame;

    // MovieClipの最大フレームを超えたらループ進行
    const maxFrame = instance.maxFrame;
    if (movieClip.currentFrame > maxFrame) {
        frame = movieClip.currentFrame % maxFrame;
        if (!frame) {
            frame = 1;
        }
    }

    const bounds = character.getBounds(frame);
    if (!bounds) {
        return ;
    }

    let style = "";
    style += `left: ${$getScreenOffsetLeft() + character.x - (bounds.xMin - character.x) - 6}px;`;
    style += `top: ${$getScreenOffsetTop() + character.y - (bounds.yMin - character.y) - 6}px;`;
    element.setAttribute("style", style);
};