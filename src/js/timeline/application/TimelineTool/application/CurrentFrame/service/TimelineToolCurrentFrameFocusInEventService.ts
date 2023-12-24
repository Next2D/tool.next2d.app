import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description フレームInput Elementのフォーカスイン、イベント処理関数
 *              Focus-in and event processing functions for frame Input Element
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    event.stopPropagation();
    event.preventDefault();

    $updateKeyLock(true);
};