import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IInstance } from "@/interface/IInstance";
import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description レイヤーのハイライトを更新
 *              Update layer highlights
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: IShareReceiveMessage): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: IInstance<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const index = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    // 外部APIを起動
    const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
    externalLayer.setLight(
        message.data[3] as NonNullable<boolean>,
        true
    );
};