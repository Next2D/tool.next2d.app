import { execute as userLanguageSettingObjectGetService } from "../../../../user/application/service/UserLanguageSettingObjectGetService";

/**
 * @description 言語設定を保存情報に合わせて表示を切り替える
 *              Switching the display of language settings to match the stored information
 *
 * @param  {HTMLSelectElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLSelectElement): void =>
{
    const language: string | null = userLanguageSettingObjectGetService();
    if (!language) {
        return ;
    }

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const node: HTMLOptionElement = children[idx] as HTMLOptionElement;
        if (language !== node.value) {
            continue;
        }

        node.selected = true;
        break;
    }
};