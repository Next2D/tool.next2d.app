import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewShapeHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaAddNewShapeHistoryUseCase";
import { Shape } from "@/core/domain/model/Shape";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {IShareReceiveMessage} message
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

    const addShape = new Shape(message.data[2] as IShapeSaveObject);

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(workSpace, addShape);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewShapeHistoryUseCase(
        workSpace,
        movieClip,
        addShape,
        true
    );
};