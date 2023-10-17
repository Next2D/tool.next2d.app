import { $LANGUAGE_ELEMENTS_CLASS_NAME } from "../../../config/LanguageConfig";
import { $getMapping } from "../LanguageUtil";

/**
 * @description 変換対象のクラス名が設定されてるElementの言語を変換
 *              Convert the language of the Element for which the class name to be converted is set.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 指定されたクラスを全て取得
    const elements: HTMLCollectionOf<Element> = document
        .getElementsByClassName($LANGUAGE_ELEMENTS_CLASS_NAME);

    const mapping = $getMapping();
    const length: number = elements.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const element: HTMLElement = elements[idx] as NonNullable<HTMLElement>;

        const text: string | undefined = element.dataset.text;
        if (!text || !mapping.has(text)) {
            continue;
        }

        // 指定言語に変換
        const value: string | undefined = mapping.get(text);
        if (!value) {
            continue;
        }

        // ショートカットの設定があれば文字列に追加
        const shortcutKey: string | undefined = element.dataset.shortcutKey;
        if (shortcutKey) {
            // TODO
            // const mapping = Util.$shortcutSetting.viewMapping.get(
            //     element.dataset.area
            // );

            // const shortcutText = mapping.has(shortcutKey)
            //     ? mapping.get(shortcutKey).text
            //     : element.dataset.shortcutText;

            // value += ` (${shortcutText})`;
        }

        element.innerText = value;
    }
};