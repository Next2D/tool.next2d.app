import { execute as shortcutGlobalCommandInitializeUseCase } from "@/shortcut/application/All/usecase/ShortcutGlobalCommandInitializeUseCase";
import { execute as shortcutRegisterEventUseCase } from "@/shortcut/application/Event/usecase/ShortcutRegisterEventUseCase";
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
        shortcutGlobalCommandInitializeUseCase();

        // 実行イベントを登録
        shortcutRegisterEventUseCase();

        return resolve();
    });
};