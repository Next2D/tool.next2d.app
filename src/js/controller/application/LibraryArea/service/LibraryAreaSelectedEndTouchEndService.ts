import { $activeTouchPointers } from "@/global/GlobalUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description タッチ終了時の処理関数、タッチポインターをクリア
 *              Processing function at the end of touch, clear touch pointer
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.pointerType !== "touch" || $useKeyboard()) {
        return ;
    }

    event.stopPropagation();
    event.preventDefault();

    $activeTouchPointers.clear();
};