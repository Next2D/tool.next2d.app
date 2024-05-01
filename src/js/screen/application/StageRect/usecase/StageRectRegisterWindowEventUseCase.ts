import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageRectWindowMouseMoveEventUseCase } from "./StageRectWindowMouseMoveEventUseCase";
import { execute as stageRectWindowMouseUpEventUseCase } from "./StageRectWindowMouseUpEventUseCase";

/**
 * @description 範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // windowイベントを登録
    window.addEventListener(EventType.MOUSE_MOVE,
        stageRectWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        stageRectWindowMouseUpEventUseCase
    );
};