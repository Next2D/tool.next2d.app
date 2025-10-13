import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";
import { execute as screenAreaCalcSelectedCharacterPositionService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedCharacterPositionService";
import { execute as transformSettingCacheBeforeMatrixService } from "@/controller/application/TransformSetting/service/TransformSettingCacheBeforeMatrixService";

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

    // 選択範囲のxy座標を取得
    const position = screenAreaCalcSelectedCharacterPositionService(movieClip);
    if (!position) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 移動量を設定
    const y = event.shiftKey ? 10 : 1;

    // モデルの情報を初期化
    transformSetting.x = 0;
    transformSetting.y = -y * workSpace.scale;

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();

    // 内部情報を更新
    await screenDisplayObjectUpdateSelectedValueService();
};