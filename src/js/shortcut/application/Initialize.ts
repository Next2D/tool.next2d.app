import { execute as shortcutToolAreaInitializeRegisterUseCase } from "@/shortcut/application/usecase/ShortcutToolAreaInitializeRegisterUseCase";
import { execute as shortcutTimelineAreaShortcutInitializeRegisterUseCase } from "@/shortcut/application/usecase/ShortcutTimelineAreaShortcutInitializeRegisterUseCase";
import { execute as shortcutLibraryAreaInitializeRegisterUseCase } from "@/shortcut/application/usecase/ShortcutLibraryAreaInitializeRegisterUseCase";
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
        // ツールエリアで利用可能なコマンドを登録
        shortcutToolAreaInitializeRegisterUseCase();

        // タイムラインのコマンドを登録
        shortcutTimelineAreaShortcutInitializeRegisterUseCase();

        // ライブラリエリアののコマンドを登録
        shortcutLibraryAreaInitializeRegisterUseCase();

        // 実行イベントを登録
        shortcutRegisterEventUseCase();

        return resolve();
    });
};