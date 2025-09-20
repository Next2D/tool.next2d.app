import type { IPivotType } from "@/interface/IPivotType";
import { $REFERENCE_SETTING_BOX_ID } from "@/config/ReferenceSettingConfig";

/**
 * @description アクティブな中心点のセルを更新
 *              Update the active pivot cell
 *
 * @param  {IPivotType} pivot
 * @return {void}
 * @method
 * @public
 */
export const execute = (pivot: IPivotType): void =>
{
    if (!pivot) {
        return ;
    }

    const element = document.getElementById($REFERENCE_SETTING_BOX_ID);
    if (!element) {
        return ;
    }

    const children = element.getElementsByClassName("reference-setting-box-child");
    if (!children || !children.length) {
        return ;
    }

    const length = children.length;
    for (let idx = 0; idx < length; idx++) {
        const node = children[idx] as HTMLElement;
        if (!node || !node.classList.contains("active")) {
            continue;
        }

        node.classList.remove("active");
    }

    let index = -1;
    switch (pivot) {

        case "top-left":
            index = 0;
            break;

        case "top-center":
            index = 1;
            break;

        case "top-right":
            index = 2;
            break;

        case "middle-left":
            index = 3;
            break;

        case "middle-center":
            index = 4;
            break;

        case "middle-right":
            index = 5;
            break;

        case "bottom-left":
            index = 6;
            break;

        case "bottom-center":
            index = 7;
            break;

        case "bottom-right":
            index = 8;
            break;

        default:
            return ;

    }

    const node = children[index] as HTMLElement;
    if (!node) {
        return ;
    }

    node.classList.add("active");
};