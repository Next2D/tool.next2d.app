import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $SCREEN_ALIGN_ID,
    $SCREEN_ORDER_ID
} from "@/config/ScreenConfig";

/**
 * @description スクリーンのメニューを選択中のElementに合わせてアクティブ・非アクティブに更新する
 *              Update the screen menu to be active/inactive according to the selected Element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        // 定規以外のメニューを非アクティブに更新
        const ids = [
            $SCREEN_ALIGN_ID,
            $SCREEN_ORDER_ID
        ];

        for (let idx = 0; idx < ids.length; ++idx) {

            const element: HTMLElement | null = document
                .getElementById(ids[idx]) as HTMLElement;

            if (!element) {
                continue ;
            }

            element.style.opacity = "0.5";
            element.style.pointerEvents = "none";
        }
    } else {
        // 定規以外のメニューを非アクティブに更新
        const ids = [
            $SCREEN_ALIGN_ID,
            $SCREEN_ORDER_ID
        ];

        for (let idx = 0; idx < ids.length; ++idx) {

            const element: HTMLElement | null = document
                .getElementById(ids[idx]) as HTMLElement;

            if (!element) {
                continue ;
            }

            element.setAttribute("style", "");
        }
    }
};