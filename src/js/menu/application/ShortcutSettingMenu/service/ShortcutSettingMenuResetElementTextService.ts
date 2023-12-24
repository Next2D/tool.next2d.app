import { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { $getTempMapping, $getViewMapping } from "../ShortcutSettingMenuUtil";

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
    if (tempMapping.size) {
        // 変更した設定のテキストを元に戻す
        for (const shortcutObject of tempMapping.values()) {

            const element: HTMLElement | null = document
                .getElementById(`shortcut-${shortcutObject.defaultKey}`);

            if (!element) {
                continue;
            }

            element.textContent = element.dataset.defaultText as NonNullable<string>;
        }
    }

    const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();
    if (viewMapping.size) {
        // 保存データがあれば、テキストを元に戻す
        for (const shortcutObject of viewMapping.values()) {

            const element: HTMLElement | null = document
                .getElementById(`shortcut-${shortcutObject.defaultKey}`);

            if (!element) {
                continue;
            }

            element.textContent = element.dataset.defaultText as NonNullable<string>;
        }
    }
};