import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateSelectedValueService";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description y座標の入力完了処理
 *              y-coordinate input completion processing
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const value = parseFloat($clamp(parseFloat(element.value), -Number.MAX_VALUE, Number.MAX_VALUE).toFixed(2));
    element.value = `${value}`;

    const workSpace = $getCurrentWorkSpace();

    // 移動した座標に更新
    transformSetting.y = (value - transformSetting.beforeValue) * workSpace.scale;

    // 選択中のDisplayObjectを指定した値で更新
    await screenDisplayObjectUpdateSelectedValueService();
};