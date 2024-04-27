import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageAreaWidthWindowMouseMoveEventUseCase } from "./StageAreaWidthWindowMouseMoveEventUseCase";
import { $setCursor } from "@/global/GlobalUtil";
import { $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";

/**
 * @description ステージエリア数値変更のマウスアップイベント
 *              Mouse up event for stage area numerical changes
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("auto");

    // windowのイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        stageAreaWidthWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const element: HTMLInputElement | null = document
        .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.focus();
};