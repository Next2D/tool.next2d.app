import { $TRANSFORM_OBJECT_SCALE_X_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのxスケールのElementの値を更新
 *              Update the value of Element in the x-scale of the deformation area
 *
 * @param  {number} scale_x
 * @return {void}
 * @method
 * @public
 */
export const execute = (scale_x: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_X_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${Math.round(scale_x * 100) / 100}`;
};