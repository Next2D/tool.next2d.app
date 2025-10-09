import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { execute as colorSettingGreenMultiplierUpdateValueUseCase } from "./ColorSettingGreenMultiplierUpdateValueUseCase";

/**
 * @description 入力完了処理
 *              Input completion processing
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    // 値を更新
    await colorSettingGreenMultiplierUpdateValueUseCase(
        $clamp(parseFloat(element.value), 0, 100)
    );
};