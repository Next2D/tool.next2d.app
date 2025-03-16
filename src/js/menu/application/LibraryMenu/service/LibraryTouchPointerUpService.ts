import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description ライブラリエリアのタッチポインターアップイベント
 *              Library area touch pointer up event
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

    event.stopPropagation();
    event.preventDefault();

    $activeTouchPointers.delete(event.pointerId);
};