import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { execute as sceneListMenuHideService } from "@/menu/application/SceneListMenu/service/SceneListMenuHideService";
import { execute as timelineSceneListExcludeElememtService } from "../service/TimelineSceneListExcludeElememtService";
import { execute as externalTimelineEditMovieClipUseCase } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseCase";

/**
 * @description タイムラインのシーン名のマウスダウンのイベント処理関数
 *              Event handling function for mouse down of a scene name in the timeline
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // メニューを非表示にする
    sceneListMenuHideService();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のMovieClipを取得
    const workSpace = $getCurrentWorkSpace();
    const libraryId = parseInt(element.dataset.libraryId as string);

    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip || movieClip.type !== $MOVIE_CLIP_TYPE) {
        return ;
    }

    // 指定のIDまでシーン名一覧を更新
    timelineSceneListExcludeElememtService(libraryId);

    // 指定のMovieClipを起動
    await externalTimelineEditMovieClipUseCase(workSpace, movieClip);
};