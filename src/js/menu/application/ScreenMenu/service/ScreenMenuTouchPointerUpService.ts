import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description タッチポインターの削除イベント
 *              Touch pointer up event
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

    $activeTouchPointers.clear();

    event.stopPropagation();
};