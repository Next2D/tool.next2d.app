import { $LANGUAGE_ELEMENTS_CLASS_NAME } from "@/config/LanguageConfig";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { $getViewMapping } from "@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil";
import { $getMapping } from "@/language/application/LanguageUtil";

/**
 * @description 変換対象のクラス名が設定されてるElementの言語を変換
 *              Convert the language of the Element for which the class name to be converted is set.
 *
 * @param  {HTMLElement} target_element
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (target_element: HTMLElement | Document): Promise<void> =>
{
    // 指定されたクラスを全て取得
    const elements: HTMLCollectionOf<Element> = target_element
        .getElementsByClassName($LANGUAGE_ELEMENTS_CLASS_NAME);

    const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();

    const mapping = $getMapping();
    const length: number = elements.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const element: HTMLElement = elements[idx] as NonNullable<HTMLElement>;

        const text: string | undefined = element.dataset.text;
        if (!text || !mapping.has(text)) {
            continue;
        }

        // 指定言語に変換
        let value: string | undefined = mapping.get(text);
        if (!value) {
            continue;
        }

        // ショートカットの設定があれば文字列に追加
        const shortcutKey: string | undefined = element.dataset.shortcutKey;
        if (shortcutKey) {

            let shortcutText: string = element.dataset.shortcutText as NonNullable<string>;
            if (viewMapping.size && viewMapping.has(shortcutKey)) {
                const shortcutObject: ShortcutViewObjectImpl | undefined = viewMapping.get(shortcutKey);
                if (shortcutObject) {
                    shortcutText = shortcutObject.text;
                }
            }

            value += ` (${shortcutText})`;
        }

        element.innerText = value;
    }
};