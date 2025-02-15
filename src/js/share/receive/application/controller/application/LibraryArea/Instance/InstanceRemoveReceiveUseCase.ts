import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { IAllSaveObject } from "@/interface/IAllSaveObject";
import { execute as externalItemRemoveUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemRemoveUseCase";

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

    // 受け取ったSaveObjectのIDからインスタンスを取得する
    const saveObject = message.data[2] as NonNullable<IAllSaveObject>;
    const instance = workSpace.getLibrary(saveObject.id);
    if (!instance) {
        return ;
    }

    // 削除を実行する
    await externalItemRemoveUseCase(workSpace, instance, true, true);
};