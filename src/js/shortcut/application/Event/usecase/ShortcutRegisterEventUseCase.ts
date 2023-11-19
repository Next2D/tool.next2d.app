import { execute as shortcutCommandService } from "../service/ShortcutCommandService";
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
    window.addEventListener("keydown", shortcutCommandService);
};