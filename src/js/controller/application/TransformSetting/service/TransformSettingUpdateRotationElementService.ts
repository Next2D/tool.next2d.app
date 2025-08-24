import { $TRANSFORM_OBJECT_ROTATE_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアの回転のElementの値を更新
 *              Update the value of Element of Rotation in the Transformation Area
 *
 * @param  {number} rotate
 * @return {void}
 * @method
 * @public
 */
export const execute = (rotate: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_ROTATE_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    if (0 > rotate) {
        rotate &= 360;
    }

    element.value = `${rotate % 360 | 0}`;
};