import { $OBJECT_SETTING_SYMBOL_AREA_ID } from "@/config/ObjectSettingConfig";

/**
 * @description オブジェクト設定のシンボルのinputを非表示
 *              Hide the symbol input in object settings
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_SYMBOL_AREA_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.style.display = "none";
};