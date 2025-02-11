import type { IShortcutViewObject } from "@/interface/IShortcutViewObject";
import { $LANGUAGE_ELEMENTS_CLASS_NAME, $LANGUAGE_SPLIT_TEXT } from "@/config/LanguageConfig";
import { $getViewMapping } from "@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil";
import {
    $getMapping,
    $sprintf
} from "@/language/application/LanguageUtil";

/**
 * @description 変換対象のクラス名が設定されてるElementの言語を変換
 *              Convert the language of the Element for which the class name to be converted is set.
 *
 * @param  {HTMLElement} target_element
 * @return {void}
 * @method
 * @public
 */
export const execute = (target_element: HTMLElement | Document): void =>
{
    // 指定されたクラスを全て取得
    const elements: HTMLCollectionOf<Element> = target_element
        .getElementsByClassName($LANGUAGE_ELEMENTS_CLASS_NAME);

    const viewMapping: Map<string, IShortcutViewObject> = $getViewMapping();

    const mapping = $getMapping();
    const length: number = elements.length;
    for (let idx = 0; idx < length; ++idx) {

        const element = elements[idx] as NonNullable<HTMLElement>;

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

            let shortcutText = element.dataset.shortcutText as NonNullable<string>;
            if (viewMapping.size && viewMapping.has(shortcutKey)) {
                const shortcutObject: IShortcutViewObject | undefined = viewMapping.get(shortcutKey);
                if (shortcutObject) {
                    shortcutText = shortcutObject.text;
                }
            }

            value += ` (${shortcutText})`;
        }

        // 置換文字があれば変換
        const args = element.dataset.args;
        if (args) {
            value = $sprintf(value, ...args.split($LANGUAGE_SPLIT_TEXT));
        }

        element.innerText = value;
    }
};