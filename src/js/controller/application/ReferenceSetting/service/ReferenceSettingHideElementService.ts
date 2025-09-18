import { $REFERENCE_POINT_ID } from "@/config/ReferenceSettingConfig";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 中心点のElementを非表示
 *              Hide the center point element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 表示中なら終了
    if (referenceSetting.state === "hide") {
        return;
    }

    const element: HTMLElement | null = document
        .getElementById($REFERENCE_POINT_ID);

    if (!element) {
        return;
    }

    // 中心点のelementを表示
    element.style.display   = "none";
    referenceSetting.state  = "hide";
    referenceSetting.active = false;
};