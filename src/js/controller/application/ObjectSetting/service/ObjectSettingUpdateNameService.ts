import { $OBJECT_SETTING_NAME_ID } from "@/config/ObjectSettingConfig";

/**
 * @description オブジェクト設定の名前の情報を更新
 *              Update name information in object settings
 *
 * @param  {string} name
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (name: string): Promise<void> =>
{
    const element: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_NAME_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = name;
};