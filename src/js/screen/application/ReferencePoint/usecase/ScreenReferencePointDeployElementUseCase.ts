import { $setReferencePointState } from "../ReferencePointUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenReferencePointShowService } from "../service/ScreenReferencePointShowService";
import { execute as screenReferencePointHideService } from "../service/ScreenReferencePointHideService";
import { execute as referencePositionGetGlobalPositionUseCase } from "@/core/application/ReferencePosition/usecase/ReferencePositionGetGlobalPositionUseCase";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
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

    // 座標が取得できない場合は非表示にして終了
    const position = referencePositionGetGlobalPositionUseCase(movieClip);
    if (!position) {
        screenReferencePointHideService();
        return ;
    }

    // 後続で表示処理を行うので、基準点のElement状態を非表示に更新
    $setReferencePointState("hide");

    // 中心点が固定されてなければセット
    if (!referenceSetting.active) {
        referenceSetting.active = true;
        referenceSetting.x = position.x;
        referenceSetting.y = position.y;
    }

    // 中心点のElementの表示処理
    screenReferencePointShowService(
        $getScreenOffsetLeft() + Math.ceil(position.x),
        $getScreenOffsetTop() + Math.ceil(position.y)
    );
};