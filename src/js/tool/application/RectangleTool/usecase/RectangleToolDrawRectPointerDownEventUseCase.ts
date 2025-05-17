import { execute as drawRectShowService } from "@/screen/application/DrawRect/service/DrawRectShowService";
import { execute as circleToolDrawRectRegisterPointerEventUseCase } from "./RectangleToolDrawRectRegisterPointerEventUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description 描画の範囲選択のマウスダウンイベント
 *              Mouse-down event of drawing range selection
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag
    ) {
        return ;
    }

    // イベントの伝播を停止
    event.stopPropagation();

    // イベントを登録
    circleToolDrawRectRegisterPointerEventUseCase(event);

    // 範囲選択のElementを表示
    drawRectShowService(event.offsetX, event.offsetY);
};