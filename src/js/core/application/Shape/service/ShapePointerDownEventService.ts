import { $getActiveTool } from "@/tool/application/ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description スクリーンに設置したShapeのDisplayObjectのマウスダウンイベント処理関数
 *              Mouse down event processing function of DisplayObject of Shape placed on the screen
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();

    // 移動用のwindowイベントを登録
    const tool = $getActiveTool();
    if (!tool) {
        return ;
    }

    tool.dispatchEvent(EventType.DISPLAY_OBJRCY, event);
};