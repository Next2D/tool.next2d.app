import { $TRANSFORM_OBJECT_SCALE_Y_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのyスケールのElementの値を更新
 *              Update the value of Element in the y-scale of the deformation area
 *
 * @param  {number} scale_y
 * @return {void}
 * @method
 * @public
 */
export const execute = (scale_y: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_Y_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${parseFloat(scale_y.toFixed(2))}`;
};