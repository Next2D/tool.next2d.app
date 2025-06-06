import { execute as shortcutCommandService } from "../service/ShortcutCommandService";

/**
 * @type {Promise}
 * @private
 */
let $pointerDownQueue: Promise<void> = Promise.resolve();

/**
 * @description キーボードイベントを登録
 *              Register keyboard events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener("keydown", (event: KeyboardEvent): void =>
    {
        $pointerDownQueue = $pointerDownQueue
            .then(() => shortcutCommandService(event));
    });
};