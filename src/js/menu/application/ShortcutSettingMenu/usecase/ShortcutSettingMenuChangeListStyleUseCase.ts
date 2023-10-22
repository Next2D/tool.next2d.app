import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";

/**
 * @description ショートカットリストの要素を選択処理
 *              Selective processing of elements in the shortcut list
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 選択されたElementのstyleを更新して、内部情報にセット
    const element: HTMLElement | null = event.target as HTMLElement;
    shortcutSettingMenuChangeListStyleService(element);
};