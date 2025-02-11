import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { execute as screenStandardPointShowElementService } from "../service/ScreenStandardPointShowElementService";
import { execute as screenStandardPointHideElementService } from "../service/ScreenStandardPointHideElementService";
import { $setStandardPointState } from "../StandardPointUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

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

    const layer = movieClip.getLayer(
        movieClip.selectedDepths.keys().next().value as number
    );
    if (!layer) {
        screenStandardPointHideElementService();
        return ;
    }

    const values = movieClip.selectedDepths.values().next().value as number[];
    const character = layer.getCharacter(movieClip.currentFrame, values[0]);
    if (!character) {
        screenStandardPointHideElementService();
        return ;
    }

    // MovieClipでなければ終了
    const instance = workSpace.getLibrary(character.libraryId) as MovieClip;
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

    // 後続で表示処理を行うので、基準点のElement状態を非表示に更新
    $setStandardPointState("hide");

    // 先祖からのmatrixを加算
    const matrix = $getConcatenatedMatrix();

    // 基準点のElementの表示処理
    screenStandardPointShowElementService(
        $getScreenOffsetLeft() + character.x * workSpace.scale + matrix[4],
        $getScreenOffsetTop() + character.y * workSpace.scale + matrix[5]
    );
};