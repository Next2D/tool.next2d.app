import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description レイヤーのロックを更新
 *              Update layer locks
 *
 * @param  {object} message
 * @return {Promise}
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

    const index = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    // 外部APIを起動
    const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
    await externalLayer.setLock(
        message.data[3] as NonNullable<boolean>,
        true
    );
};