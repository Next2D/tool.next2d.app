import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import {
    $TOOL_MAX_STROKE_SIZE,
    $TOOL_MIN_STROKE_SIZE
} from "@/config/ToolConfig";
import { strokeSize } from "@/tool/domain/model/StrokeSize";

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

    // inputの値を更新
    const width = $clamp(parseInt(element.value), $TOOL_MIN_STROKE_SIZE, $TOOL_MAX_STROKE_SIZE);

    // 内部情報を更新
    strokeSize.value = width;
    element.value = `${width}`;
};