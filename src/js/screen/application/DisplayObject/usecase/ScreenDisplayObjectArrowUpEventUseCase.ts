import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";
import { execute as screenAreaCalcSelectedCharacterPositionService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedCharacterPositionService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenReferencePointMoveElementService } from "@/screen/application/ReferencePoint/service/ScreenReferencePointMoveElementService";

/**
 * @description DisplayObjectのキーボードイベント、上方向に移動
 *              DisplayObject keyboard event, moving upward
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

    // 選択範囲のbounding boxを計算
    const position = screenAreaCalcSelectedCharacterPositionService(movieClip);
    if (!position) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 移動量を設定
    const y = event.shiftKey ? 10 : 1;

    // モデルの情報を初期化
    transformSetting.x = 0;
    transformSetting.y = -y * workSpace.scale;

    // プロパティーエリアの値を更新
    transformSettingUpdateYElementService(position.y - y);

    // 基準点のElementを移動
    screenReferencePointMoveElementService(0, -y);

    // 内部情報を更新
    await screenDisplayObjectUpdateSelectedValueService();
};