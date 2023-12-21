import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { $getViewMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットのテキスト情報をviewデータを元に更新
 *              Update shortcut text information based on view data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();
    if (!viewMapping.size) {
        return ;
    }

    // カスタム設定を行ったテキストに変更する
    for (const shortcutObject of viewMapping.values()) {

        const element: HTMLElement | null = document
            .getElementById(`shortcut-${shortcutObject.defaultKey}`);

        if (!element) {
            continue;
        }

        element.textContent = shortcutObject.text;
    }
};