import { $SHORTCUT_SETTING_LIST_CLASS_NAME } from "../../../../config/ShortcutConfig";
import type { ShortcutObjectImpl } from "../../../../interface/ShortcutObjectImpl";
import { $replace } from "../../../../language/application/LanguageUtil";

/**
 * @description ショートカットリストのElementをstringで返却
 *              Return Element of shortcut list as string
 *
 * @params {object} shortcut_object
 * @params {string} [custom_text=""]
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    shortcut_object: ShortcutObjectImpl,
    custom_text: string = ""
): string =>
{
    return `
<div class="${$SHORTCUT_SETTING_LIST_CLASS_NAME}">
    <i class="${shortcut_object.css}"></i>
    <div class="description">
        <span class="language" data-text="${shortcut_object.description}">${$replace(shortcut_object.description)}</span>
    </div>
    <div class="command" data-default-key="${shortcut_object.key}">${custom_text || shortcut_object.text}</div>
</div>
`;
};