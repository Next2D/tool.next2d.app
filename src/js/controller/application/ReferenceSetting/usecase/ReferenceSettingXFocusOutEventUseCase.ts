import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description 中心点のx座標の入力完了処理
 *              Focus event processing of the center point area x coordinates
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

    const x = $clamp(
        Math.ceil(parseFloat(element.value)),
        -Number.MAX_VALUE, Number.MAX_VALUE
    );
    element.value = `${x}`;
};