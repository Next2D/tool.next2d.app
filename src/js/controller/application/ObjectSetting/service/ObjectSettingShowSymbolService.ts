import { $OBJECT_SETTING_SYMBOL_AREA_ID } from "@/config/ObjectSettingConfig";

/**
 * @description オブジェクト設定のシンボルのinputを表示
 *              Display the symbol input in object settings
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const element: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_SYMBOL_AREA_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.style.display = "";
};