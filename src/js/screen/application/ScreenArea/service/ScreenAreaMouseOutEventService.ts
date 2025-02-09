import { $getActiveTool } from "@/tool/application/ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { screenArea } from "@/screen/domain/model/ScreenArea";

/**
 * @description スクリーンエリアのマウスアウトイベントの実行関数
 *              Execution function of mouse-out event in screen area
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // スクリーンエリアへのマウスアウトをセット
    screenArea.active = false;

    const tool = $getActiveTool();
    if (!tool) {
        return ;
    }

    // 起動中のツールにマウスアウトイベントを発行
    tool.dispatchEvent(EventType.POINTER_OUT, event);
};