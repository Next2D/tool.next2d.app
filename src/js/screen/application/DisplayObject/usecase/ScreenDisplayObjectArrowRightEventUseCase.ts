import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as screenAreaCalcSelectedCharacterPositionService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedCharacterPositionService";

/**
 * @description DisplayObjectのキーボードイベント、右方向に移動
 *              Keyboard event of DisplayObject, move to the right
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
    const position = screenAreaCalcSelectedCharacterPositionService(movieClip);
    if (!position) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 移動量を設定
    const x = event.shiftKey ? 10 : 1;

    // モデルの情報を初期化
    transformSetting.x = x;
    transformSetting.y = 0;

    // プロパティーエリアの値を更新
    transformSettingUpdateXElementService(position.x + x);

    // 内部情報を更新
    screenDisplayObjectUpdateSelectedValueService();
};