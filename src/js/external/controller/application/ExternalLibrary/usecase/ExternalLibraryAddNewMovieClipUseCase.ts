import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewMovieClipHistoryUseCase } from "@/history/application/controller/application/LibraryArea/MovieClip/usecase/LibraryAreaAddNewMovieClipHistoryUseCase";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description 新規MovieClipの追加ユースケース
 *              Add New MovieClip Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string} name
 * @param  {number} folder_id
 * @param  {boolean} [reload = true]
 * @return {MovieClip}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    name: string,
    folder_id: number = 0,
    reload: boolean = true
): Promise<MovieClip> => {

    // フォルダのデータを生成
    const movieClip = new MovieClip({
        "id": work_space.nextLibraryId,
        "name": name,
        "type": $MOVIE_CLIP_TYPE,
        "folderId": folder_id
    });

    // 名前の重複時は改名
    while (work_space.pathMap.has(movieClip.getPath(work_space))) {
        movieClip.name += "_(2)";
    }

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(work_space, movieClip, reload);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewMovieClipHistoryUseCase(
        work_space,
        movie_clip,
        movieClip
    );

    return movieClip;
};