import { $SHORTCUT_SETTING_LIST_CLASS_NAME } from "@/config/ShortcutConfig";
import type { ShortcutObjectImpl } from "@/interface/ShortcutObjectImpl";

/**
 * @description ショートカットリストのElementをstringで返却
 *              Return Element of shortcut list as string
 *
 * @params {object} shortcut_object
 * @params {string} text
 * @return {string}
 * @method
 * @public
 */
export const execute = (shortcut_object: ShortcutObjectImpl, text: string): string =>
{
    return `
<div class="${$SHORTCUT_SETTING_LIST_CLASS_NAME}">
    <i class="${shortcut_object.css}"></i>
    <div class="description">
        <span class="language" data-text="${shortcut_object.description}">${shortcut_object.description}</span>
    </div>
    <div class="command" data-default-key="${shortcut_object.key}" data-default-text="${shortcut_object.text}">${text}</div>
</div>
`;
};