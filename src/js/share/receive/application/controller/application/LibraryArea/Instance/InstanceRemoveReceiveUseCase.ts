import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { AllSaveObjectImpl } from "@/interface/AllSaveObjectImpl";
import { execute as externalItemRemoveUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemRemoveUseCase";

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

    // 受け取ったSaveObjectのIDからインスタンスを取得する
    const saveObject = message.data[2] as NonNullable<AllSaveObjectImpl>;
    const instance: InstanceImpl<any> = workSpace.getLibrary(saveObject.id);

    // 削除を実行する
    externalItemRemoveUseCase(workSpace, instance, true, true);
};