import { EventType } from "@/tool/domain/event/EventType";
import { execute as zoomPlusToolStageRectWindowMouseMoveEventUseCase } from "./ZoomPlusToolStageRectWindowMouseMoveEventUseCase";
import { execute as zoomPlusToolStageRectWindowMouseUpEventUseCase } from "./ZoomPlusToolStageRectWindowMouseUpEventUseCase";

/**
 * @description 拡大の範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection of the zoom
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // windowイベントを登録
    // window.addEventListener(EventType.MOUSE_MOVE,
    //     zoomPlusToolStageRectWindowMouseMoveEventUseCase
    // );
    // window.addEventListener(EventType.MOUSE_UP,
    //     zoomPlusToolStageRectWindowMouseUpEventUseCase
    // );
};