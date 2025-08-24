import { $TRANSFORM_OBJECT_X_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのx座標のElementの値を更新
 *              Update the value of the x-coordinate element in the transform area
 *
 * @param  {number} x
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_X_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${Math.round(x * 100) / 100}`;
};