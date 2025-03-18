import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineSceneListClearAddRootUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListClearAddRootUseCase";
import { execute as externalTimelineEditMovieClipUseCase } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseCase";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 選択されたMovieClipを起動
 *              Launch selected MovieClip
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 選択中のアイテムが1個じゃない時はスキップ
    if (libraryArea.selectedIds.length !== 1) {
        return ;
    }

    const libraryId = libraryArea.selectedIds[0];
    const workSpcae = $getCurrentWorkSpace();

    const movieClip = workSpcae.getLibrary(libraryId) as MovieClip;
    if (!movieClip || movieClip.type !== $MOVIE_CLIP_TYPE) {
        return ;
    }

    // タイムラインのシーン名を初期化してrootを追加
    timelineSceneListClearAddRootUseCase();

    // 指定のMovieClipを編集モードに切り替える
    await externalTimelineEditMovieClipUseCase(workSpcae, movieClip);
};