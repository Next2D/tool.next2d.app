import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { execute as libraryAreaUpdateBitmapHistoryUseCase } from "@/history/application/controller/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryUseCase";
import { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";

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

    const bitmap = new Bitmap(
        message.data[3] as NonNullable<BitmapSaveObjectImpl>
    );

    // 内部情報に追加
    // fixed logic
    workSpace.libraries.set(bitmap.id, bitmap);

    // 作業履歴に残す
    // fixed logic
    libraryAreaUpdateBitmapHistoryUseCase(
        workSpace,
        movieClip,
        message.data[2] as NonNullable<BitmapSaveObjectImpl>,
        bitmap.toObject(),
        true
    );
};