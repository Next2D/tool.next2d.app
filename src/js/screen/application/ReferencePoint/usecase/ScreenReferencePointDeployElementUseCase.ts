import { $setReferencePointState } from "../ReferencePointUtil";
import { $getConcatenatedMatrix, $multiplicationMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import { execute as screenReferencePointShowService } from "../service/ScreenReferencePointShowService";
import { execute as screenReferencePointHideService } from "../service/ScreenReferencePointHideService";

/**
 * @description 変形の中心点のElementを配置
 *              Places the Element at the center point of the deformation
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
        screenReferencePointHideService();
        return ;
    }

    // 複数選択なら終了
    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        screenReferencePointHideService();
        return ;
    }

    const layer = movieClip.getLayer(
        movieClip.selectedDepths.keys().next().value as number
    );
    if (!layer) {
        screenReferencePointHideService();
        return ;
    }

    const values = movieClip.selectedDepths.values().next().value as number[];
    const character = layer.getCharacter(movieClip.currentFrame, values[0]);
    if (!character) {
        screenReferencePointHideService();
        return ;
    }

    // 後続で表示処理を行うので、基準点のElement状態を非表示に更新
    $setReferencePointState("hide");

    // 先祖からのmatrixを加算
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = $multiplicationMatrix(
        concatenatedMatrix,
        character.matrix
    );

    const x = character.referencePosition.x * matrix[0] + character.referencePosition.y * matrix[2] + matrix[4];
    const y = character.referencePosition.x * matrix[1] + character.referencePosition.y * matrix[3] + matrix[5];

    // 基準点のElementの表示処理
    screenReferencePointShowService(
        $getScreenOffsetLeft() + x,
        $getScreenOffsetTop() + y
    );
};