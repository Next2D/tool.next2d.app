import { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { $getTempMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットのテキスト情報をtempデータを元にリセット
 *              Reset shortcut text information based on temp data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const tempMapping: Map<string, ShortcutViewObjectImpl> = $getTempMapping();
    if (!tempMapping.size) {
        return ;
    }

    // カスタム設定を行ったテキストに変更する
    for (const shortcutObject of tempMapping.values()) {

        const element: HTMLElement | null = document
            .getElementById(`shortcut-${shortcutObject.defaultKey}`);

        if (!element) {
            continue;
        }

        element.textContent = element.dataset.defaultText as NonNullable<string>;
    }
};