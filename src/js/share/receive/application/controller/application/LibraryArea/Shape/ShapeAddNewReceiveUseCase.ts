import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewShapeHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaAddNewShapeHistoryUseCase";
import { Shape } from "@/core/domain/model/Shape";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const addShape = new Shape(message.data[2] as ShapeSaveObjectImpl);

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(workSpace, addShape);

    // 作業履歴に残す
    // fixed logic
    libraryAreaAddNewShapeHistoryUseCase(
        workSpace,
        movieClip,
        addShape,
        true
    );
};