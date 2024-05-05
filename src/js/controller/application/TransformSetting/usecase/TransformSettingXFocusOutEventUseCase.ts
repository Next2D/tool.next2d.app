import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getMovePositon } from "@/tool/application/ToolUtil";
import { $getBeforeValue } from "../TransformSettingUtil";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateSelectedValueService";

/**
 * @description x座標の入力完了処理
 *              x-coordinate input completion processing
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードを終了する
    $updateKeyLock(false);

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const value = parseFloat(parseFloat(element.value).toFixed(2));
    element.value = `${value}`;

    // 移動した座標に更新
    const movePosition = $getMovePositon();
    movePosition.x = value - $getBeforeValue();

    // 選択中のDisplayObjectを指定した値で更新
    screenDisplayObjectUpdateSelectedValueService();
};