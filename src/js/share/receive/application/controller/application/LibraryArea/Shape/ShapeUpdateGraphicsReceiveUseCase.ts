import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { BoundsImpl } from "@/interface/BoundsImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalShapeApplyGraphicsUseCase } from "@/external/core/application/ExternalShape/usecase/ExternalShapeApplyGraphicsUseCase";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: ShareReceiveMessageImpl): Promise<void> =>
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

    const beforeShapeObject = message.data[2] as ShapeSaveObjectImpl;
    const shape = workSpace.getLibrary(beforeShapeObject.id);
    if (!shape) {
        return ;
    }

    // Shapeのグラフィックスを更新
    await externalShapeApplyGraphicsUseCase(
        workSpace,
        movieClip,
        shape,
        message.data[3] as number[],
        message.data[4] as BoundsImpl,
        true
    );
};