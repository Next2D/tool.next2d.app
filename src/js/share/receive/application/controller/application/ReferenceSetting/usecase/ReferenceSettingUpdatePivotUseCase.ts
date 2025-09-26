import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPivotType } from "@/interface/IPivotType";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalReferenceSetPivotUseCase } from "@/external/controller/application/ExternalReference/usecase/ExternalReferenceSetPivotUseCase";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {void}
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

    const movieClipId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(movieClipId) as MovieClip;
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

    // 中心点を設定
    await externalReferenceSetPivotUseCase(
        workSpace,
        movieClip,
        message.data[7] as NonNullable<IPivotType>,
        layer,
        character,
        true
    );
};