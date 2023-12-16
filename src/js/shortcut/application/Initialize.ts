import { execute as shortcutGlobalCommandInitializeRegisterUseCase } from "@/shortcut/application/usecase/ShortcutGlobalCommandInitializeRegisterUseCase";
import { execute as timelineShortcutInitializeRegisterUseCase } from "@/shortcut/application/usecase/TimelineShortcutInitializeRegisterUseCase";
import { execute as shortcutRegisterEventUseCase } from "@/shortcut/application/usecase/ShortcutRegisterEventUseCase";
/**
 * @description ショートカット機能の初期起動関数
 *              Initial startup function for shortcut functions
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        // 全体で利用可能なコマンドを登録
        shortcutGlobalCommandInitializeRegisterUseCase();

        // タイムラインのコマンドを登録
        timelineShortcutInitializeRegisterUseCase();

        // 実行イベントを登録
        shortcutRegisterEventUseCase();

        return resolve();
    });
};