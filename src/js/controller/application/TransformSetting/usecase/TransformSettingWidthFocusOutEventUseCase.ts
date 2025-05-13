import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description 幅の入力完了処理
 *              Width input completion processing
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

    // 入力モードを終了する
    $updateKeyLock(false);

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const value = parseFloat($clamp(parseFloat(element.value), -Number.MAX_VALUE, Number.MAX_VALUE).toFixed(2));
    element.value = `${value}`;
};