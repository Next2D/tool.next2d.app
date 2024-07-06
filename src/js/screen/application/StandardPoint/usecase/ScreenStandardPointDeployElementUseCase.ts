import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { execute as screenStandardPointShowElementService } from "../service/ScreenStandardPointShowElementService";
import { execute as screenStandardPointHideElementService } from "../service/ScreenStandardPointHideElementService";

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
        screenStandardPointHideElementService();
        return ;
    }

    // 複数選択なら終了
    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        screenStandardPointHideElementService();
        return ;
    }

    const layer = movieClip.getLayer(movieClip.selectedDepths.keys().next().value);
    if (!layer) {
        screenStandardPointHideElementService();
        return ;
    }

    const depth = movieClip.selectedDepths.values().next().value[0];
    const character = layer.getCharacter(movieClip.currentFrame, depth);
    if (!character) {
        screenStandardPointHideElementService();
        return ;
    }

    // MovieClipでなければ終了
    const instance: MovieClip = workSpace.getLibrary(character.libraryId);
    if (!instance || instance.type !== $MOVIE_CLIP_TYPE) {
        screenStandardPointHideElementService();
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

    // 基準点のElementを表示
    screenStandardPointShowElementService(
        $getScreenOffsetLeft() + character.x,
        $getScreenOffsetTop() + character.y
    );
};