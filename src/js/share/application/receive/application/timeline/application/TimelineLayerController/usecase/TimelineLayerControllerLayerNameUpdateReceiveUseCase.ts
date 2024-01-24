import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalLayerUpdateNameUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateNameUseCase";

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

    const layerId = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layerId);
    if (!layer) {
        return ;
    }

    // レイヤー名を更新
    const name = message.data[4] as NonNullable<string>;
    externalLayerUpdateNameUseCase(
        workSpace, movieClip, layer, name
    );
};