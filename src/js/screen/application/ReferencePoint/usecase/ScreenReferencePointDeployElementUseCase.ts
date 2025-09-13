import { $setReferencePointState } from "../ReferencePointUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Matrix } from "@next2d/geom";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { execute as screenReferencePointShowService } from "../service/ScreenReferencePointShowService";
import { execute as screenReferencePointHideService } from "../service/ScreenReferencePointHideService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

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
    let matrix = $getConcatenatedMatrix();
    if (movieClip.isSingleSelectedOfDisplayObject()) {
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

        // 先祖からのmatrixを加算
        matrix = Matrix.multiply(
            $getConcatenatedMatrix(),
            character.matrix
        );

        referenceSetting.x = character.referencePosition.x;
        referenceSetting.y = character.referencePosition.y;
    } else {
        const bounds = screenAreaCalcSelectedBoundsService(movieClip);
        if (!bounds) {
            screenReferencePointHideService();
            return ;
        }

        switch (referenceSetting.pivot) {

            case "top-left":
                referenceSetting.x = bounds.xMin;
                referenceSetting.y = bounds.yMin;
                break;

            case "top-center":
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin) / 2;
                referenceSetting.y = bounds.yMin;
                break;

            case "top-right":
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin);
                referenceSetting.y = bounds.yMin;
                break;

            case "middle-left":
                referenceSetting.x = bounds.xMin;
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin) / 2;
                break;

            case "middle-center":
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin) / 2;
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin) / 2;
                break;

            case "middle-right":
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin);
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin) / 2;
                break;

            case "bottom-left":
                referenceSetting.x = bounds.xMin;
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin);
                break;

            case "bottom-center":
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin) / 2;
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin);
                break;

            case "bottom-right":
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin);
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin);
                break;

            default:
                referenceSetting.x = bounds.xMin + (bounds.xMax - bounds.xMin) / 2;
                referenceSetting.y = bounds.yMin + (bounds.yMax - bounds.yMin) / 2;
                break;

        }
    }

    // 後続で表示処理を行うので、基準点のElement状態を非表示に更新
    $setReferencePointState("hide");

    const x = referenceSetting.x * matrix[0] + referenceSetting.y * matrix[2] + matrix[4];
    const y = referenceSetting.x * matrix[1] + referenceSetting.y * matrix[3] + matrix[5];

    // 中心点のElementの表示処理
    screenReferencePointShowService(
        $getScreenOffsetLeft() + x,
        $getScreenOffsetTop() + y
    );
};