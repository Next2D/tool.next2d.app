import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { $ZOOM_MAX_VALUE, $ZOOM_MIN_VALUE } from "@/config/ZoomConfig";
import { execute as zoomToolRealodWorkSpaceUseCase } from "./ZoomToolRealodWorkSpaceUseCase";

/**
 * @description ズームinputのフォーカスアウト処理
 *              Zoom input focus out processing
 *
 * @param  {FocusEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
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

    // inputの値を更新
    const scale = $clamp(parseInt(element.value), $ZOOM_MIN_VALUE, $ZOOM_MAX_VALUE);
    element.value = `${scale}`;

    // 内部情報を更新
    await zoomToolRealodWorkSpaceUseCase(scale / 100);
};