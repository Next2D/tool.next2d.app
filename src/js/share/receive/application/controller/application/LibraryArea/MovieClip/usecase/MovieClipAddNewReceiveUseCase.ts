import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewMovieClipHistoryUseCase } from "@/history/application/controller/application/LibraryArea/MovieClip/usecase/LibraryAreaAddNewMovieClipHistoryUseCase";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (message: IShareReceiveMessage): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const addMovieClip = new MovieClip({
        "id": message.data[2] as NonNullable<number>,
        "name": message.data[3] as NonNullable<string>,
        "folderId": message.data[4] as NonNullable<number>,
        "type": $MOVIE_CLIP_TYPE
    });

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(workSpace, addMovieClip);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewMovieClipHistoryUseCase(
        workSpace,
        movieClip,
        addMovieClip,
        true
    );
};