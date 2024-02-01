import { $TIMELINE_SCENE_NAME_ID } from "@/config/TimelineConfig";

/**
 * @description タイムラインのツールエリアのシーン名を更新
 *              Updated scene names in the tool area of the timeline
 *
 * @param  {string} name
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (name: string): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_ID);

    if (!element) {
        return ;
    }

    element.textContent = name;
};