import { $TRANSFORM_REFERENCE_Y_ID } from "@/config/ReferenceSettingConfig";

/**
 * @description 中心点のy座標入力エリアに値を設定する
 *              Set value to the y-coordinate input area for the reference point
 *
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (y: number): void =>
{
    const element = document
        .getElementById($TRANSFORM_REFERENCE_Y_ID) as HTMLInputElement | null;

    if (!element) {
        return ;
    }

    element.value = `${Math.ceil(y)}`;
};