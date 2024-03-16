import { $TIMELINE_TARGET_GROUP_ID } from "@/config/TimelineConfig";

/**
 * @description フレーム選択したグループを非アクティブにする
 *              Deactivate the group of frames selected
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_TARGET_GROUP_ID);

    if (!element) {
        return ;
    }

    element.style.display = "none";
};