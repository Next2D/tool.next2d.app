import { $TRANSFORM_OBJECT_HEIGHT_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアの高さのElementの値を更新
 *              Update the value of the height element in the transform area
 *
 * @param  {number} height
 * @return {void}
 * @method
 * @public
 */
export const execute = (height: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_HEIGHT_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${height}`;
};