import { execute as stageRectShowService } from "@/screen/application/StageRect/service/StageRectShowService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolStageRectPointerMoveEventUseCase } from "./ArrowToolStageRectPointerMoveEventUseCase";
import { execute as arrowToolStageRectPointerUpEventUseCase } from "./ArrowToolStageRectPointerUpEventUseCase";

/**
 * @description 範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection
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

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を停止
    event.stopPropagation();

    // イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.POINTER_MOVE,
        arrowToolStageRectPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(EventType.POINTER_UP,
        arrowToolStageRectPointerUpEventUseCase
    );
    element.addEventListener(EventType.POINTER_CANCEL,
        arrowToolStageRectPointerUpEventUseCase
    );
    element.addEventListener(EventType.POINTER_LEAVE,
        arrowToolStageRectPointerUpEventUseCase
    );

    // 範囲選択のElementを表示
    stageRectShowService(event.offsetX, event.offsetY);
};