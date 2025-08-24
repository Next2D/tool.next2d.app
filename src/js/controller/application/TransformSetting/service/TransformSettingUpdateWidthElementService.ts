import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアの幅のElementの値を更新
 *              Update the value of the width element in the transform area
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const execute = (width: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${Math.round(width * 100) / 100}`;
};