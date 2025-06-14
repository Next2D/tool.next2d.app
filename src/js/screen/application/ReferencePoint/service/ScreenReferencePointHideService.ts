import { $SCREEN_REFERENCE_POINT_ID } from "@/config/ScreenConfig";
import {
    $getReferencePointState,
    $setReferencePointState
} from "../ReferencePointUtil";

/**
 * @description 変形の基準点のElementを非表示
 *              Hide the reference point Element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if ($getReferencePointState() === "hide") {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_REFERENCE_POINT_ID);

    if (!element) {
        return ;
    }

    // 非表示に更新
    element.setAttribute("style", "display: none;");

    // 状態を更新
    $setReferencePointState("hide");
};