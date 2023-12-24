import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description フレームInput Elementのフォーカスアウト、イベント処理関数
 *              Focus out of frame Input Element, event handling function
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

    $updateKeyLock(false);
};