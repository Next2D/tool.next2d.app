import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalCharacterUpdateYUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateYUseCase";

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

    const layerIndex = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layerIndex);
    if (!layer) {
        return ;
    }

    const keyframe = message.data[3] as NonNullable<number>;
    const depth    = message.data[4] as NonNullable<number>;

    // キャラクターを取得
    const character = layer.getCharacter(keyframe, depth);
    if (!character) {
        return ;
    }

    // y座標を更新
    externalCharacterUpdateYUseCase(
        workSpace,
        movieClip,
        layer,
        character,
        message.data[6] as NonNullable<number>,
        true
    );
};