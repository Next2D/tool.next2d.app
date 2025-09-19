import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { execute as screenStandardPointShowElementService } from "../service/ScreenStandardPointShowElementService";
import { execute as screenStandardPointHideElementService } from "../service/ScreenStandardPointHideElementService";
import { $setStandardPointState } from "../StandardPointUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { Matrix } from "@next2d/geom";

/**
 * @description MovieClipの基準点Elementを配置
 *              Place the reference point Element of the MovieClip
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

    const bounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!bounds) {
        screenStandardPointHideElementService();
        return;
    }

    // 後続で表示処理を行うので、基準点のElement状態を非表示に更新
    $setStandardPointState("hide");

    // 先祖からのmatrixを加算
    const matrix = Matrix.multiply($getConcatenatedMatrix(), character.matrix);
    screenStandardPointShowElementService(
        $getScreenOffsetLeft() + Math.ceil(matrix[4]),
        $getScreenOffsetTop() + Math.ceil(matrix[5])
    );
};