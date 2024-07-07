import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { $ZOOM_MAX_VALUE, $ZOOM_MIN_VALUE } from "@/config/ZoomConfig";

/**
 * @description y座標の入力完了処理
 *              y-coordinate input completion processing
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

    const scale = $clamp(parseInt(element.value), $ZOOM_MIN_VALUE, $ZOOM_MAX_VALUE);
    element.value = `${scale}`;
};