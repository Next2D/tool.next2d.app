import { $TRANSFORM_REFERENCE_X_ID } from "@/config/ReferenceSettingConfig";

/**
 * @description 中心点のx座標入力エリアに値を設定する
 *              Set value to the x-coordinate input area for the reference point
 *
 * @param {number} x
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number): void =>
{
    const element = document
        .getElementById($TRANSFORM_REFERENCE_X_ID) as HTMLInputElement | null;

    if (!element) {
        return ;
    }

    element.value = `${Math.ceil(x)}`;
};