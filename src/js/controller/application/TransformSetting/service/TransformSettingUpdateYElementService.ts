import { $TRANSFORM_OBJECT_Y_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのy座標のElementの値を更新
 *              Update the value of the y-coordinate element in the transform area
 *
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (y: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_Y_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${parseFloat(y.toFixed(2))}`;
};