import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Instance } from "@/core/domain/model/Instance";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalItemUpdateNameUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemUpdateNameUseCase";

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

    const movieClipId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(movieClipId);
    if (!movieClip) {
        return ;
    }

    const libraryId = message.data[2] as NonNullable<number>;
    const instance: InstanceImpl<Instance> = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    // 名前を更新
    externalItemUpdateNameUseCase(
        workSpace,
        movieClip,
        instance,
        message.data[4] as NonNullable<string>,
        true
    );
};