import { $OBJECT_SETTING_SYMBOL_ID } from "@/config/ObjectSettingConfig";

/**
 * @description オブジェクト設定のシンボルの情報を更新
 *              Update information on symbols in object settings
 *
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (name: string): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_SYMBOL_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = name;
};