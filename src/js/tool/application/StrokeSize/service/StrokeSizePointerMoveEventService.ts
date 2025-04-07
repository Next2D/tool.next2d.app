import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";
import {
    $TOOL_MAX_STROKE_SIZE,
    $TOOL_MIN_STROKE_SIZE
} from "@/config/ToolConfig";
import { strokeSize } from "@/tool/domain/model/StrokeSize";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 線の幅のinuputの値操作のマウスムーブイベント
 *              Mouse move event of value operation of line width input
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // メニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(async (): Promise<void> =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const value = parseInt(element.value);
        const width = $clamp(value + event.movementX, $TOOL_MIN_STROKE_SIZE, $TOOL_MAX_STROKE_SIZE);
        element.value = `${width}`;

        // 内部の値を更新
        strokeSize.value = width;
    });
};