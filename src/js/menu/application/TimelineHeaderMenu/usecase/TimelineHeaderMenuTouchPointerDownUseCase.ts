
import { execute as timelineHeaderMenuShowUseCase } from "./TimelineHeaderMenuShowUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description ライブラリエリアのタッチポインターダウンイベント
 *             Library area touch pointer down event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.pointerType !== "touch") {
        return ;
    }

    $activeTouchPointers.add(event.pointerId);
    if ($activeTouchPointers.size === 1) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    if ($activeTouchPointers.size !== 2) {
        return ;
    }

    timelineHeaderMenuShowUseCase(event);
};