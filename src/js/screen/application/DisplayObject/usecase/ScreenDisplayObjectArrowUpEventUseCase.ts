import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as screenDisplayObjectSelectedMoveElementService } from "../service/ScreenDisplayObjectSelectedMoveElementService";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";

/**
 * @description DisplayObjectのキーボードイベント、上方向に移動
 *              DisplayObject keyboard event, moving upward
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // 選択範囲のbounding boxを計算
    const calcBounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!calcBounds) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 移動量を設定
    const y = event.shiftKey ? 10 : 1;

    // モデルの情報を初期化
    transformSetting.x = 0;
    transformSetting.y = 0;

    // 選択中のElementを上方向へ移動
    screenDisplayObjectSelectedMoveElementService(0, -y);

    // プロパティーエリアの値を更新
    transformSettingUpdateYElementService(calcBounds.yMin - y);

    // 内部情報を更新
    // fixed logic
    screenDisplayObjectUpdateSelectedValueService();
};