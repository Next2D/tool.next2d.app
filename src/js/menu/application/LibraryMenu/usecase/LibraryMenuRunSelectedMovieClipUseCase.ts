import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineSceneListClearAddRootUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListClearAddRootUseCase";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { execute as externalTimelineEditMovieClipUseService } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseService";

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

    const movieClip: InstanceImpl<MovieClip> = workSpcae.getLibrary(libraryId);
    if (!movieClip || movieClip.type !== $MOVIE_CLIP_TYPE) {
        return ;
    }

    // タイムラインのシーン名を初期化してrootを追加
    timelineSceneListClearAddRootUseCase();

    // 指定のMovieClipを編集モードに切り替える
    await externalTimelineEditMovieClipUseService(workSpcae, movieClip);
};