import { execute as stageRectShowService } from "@/screen/application/StageRect/service/StageRectShowService";
import { execute as arrowToolStageRectRegisterPointerEventUseCase } from "./ArrowToolStageRectRegisterPointerEventUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $activeTouchPointers } from "@/global/GlobalUtil";

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

    // イベントの伝播を停止
    event.stopPropagation();

    // イベントを登録
    arrowToolStageRectRegisterPointerEventUseCase(event);

    // 範囲選択のElementを表示
    stageRectShowService(event.offsetX, event.offsetY);
};