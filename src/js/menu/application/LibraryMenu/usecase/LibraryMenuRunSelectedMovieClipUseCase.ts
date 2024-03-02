import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineSceneListClearAddRootUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListClearAddRootUseCase";

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
    if (!movieClip || movieClip.type !== "container") {
        return ;
    }

    // タイムラインのシーン名を初期化してrootを追加
    timelineSceneListClearAddRootUseCase();

    const externalWorkSpace = new ExternalWorkSpace(workSpcae);
    await externalWorkSpace.runMovieClip(
        new ExternalMovieClip(workSpcae, movieClip)
    );
};