import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";

/**
 * @description シーン一覧の親のMovieClipを指定のIDまで除外する
 *              Exclude the parent MovieClip in the scene list up to the specified ID
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!parent) {
        return ;
    }

    // 一覧を後ろからループして対象のIDまでを除外
    while (timelineSceneList.scenes.length) {

        const parentId = timelineSceneList.scenes.pop() as NonNullable<number>;

        const element = parent.lastElementChild as HTMLElement;
        if (!element) {
            break;
        }

        // 対象のelementを削除
        element.remove();

        // 指定のIDなら終了
        if (parentId === library_id) {
            break;
        }
    }
};