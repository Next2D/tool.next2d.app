import { screenArea } from "@/screen/domain/model/ScreenArea";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description スクリーンエリアのマウスオーバーイベントの実行関数
 *              Execution function of mouse-over event in screen area
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // スクリーンエリアへのマウスオーバーをセット
    screenArea.active = true;

    const tool = $getActiveTool();
    if (!tool) {
        return ;
    }

    // 起動中のツールにマウスオーバーイベントを発行
    tool.dispatchEvent(EventType.POINTER_OVER, event);
};