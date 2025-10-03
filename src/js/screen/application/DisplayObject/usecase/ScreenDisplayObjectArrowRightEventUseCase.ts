import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";
import { execute as screenAreaCalcSelectedCharacterPositionService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedCharacterPositionService";
import {
    $TRANSFORM_OBJECT_X_ID,
    $TRANSFORM_OBJECT_Y_ID
} from "@/config/TransformSettingConfig";

/**
 * @description DisplayObjectのキーボードイベント、右方向に移動
 *              Keyboard event of DisplayObject, move to the right
 *
 * @param  {KeyboardEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: KeyboardEvent): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const transformObjectXElement = document
        .getElementById($TRANSFORM_OBJECT_X_ID) as HTMLInputElement | null;
    if (!transformObjectXElement) {
        return;
    }
    const transformObjectYElement = document
        .getElementById($TRANSFORM_OBJECT_Y_ID) as HTMLInputElement | null;
    if (!transformObjectYElement) {
        return;
    }

    // 選択範囲のxy座標を取得
    const position = screenAreaCalcSelectedCharacterPositionService(movieClip);
    if (!position) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    transformSetting.beforeX = parseFloat(transformObjectXElement.value);
    transformSetting.beforeY = parseFloat(transformObjectYElement.value);

    // 移動量を設定
    const x = event.shiftKey ? 10 : 1;

    // モデルの情報を初期化
    transformSetting.x = x * workSpace.scale;
    transformSetting.y = 0;

    // 内部情報を更新
    await screenDisplayObjectUpdateSelectedValueService();
};