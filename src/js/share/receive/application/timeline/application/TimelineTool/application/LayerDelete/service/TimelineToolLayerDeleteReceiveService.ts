import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
  * @description レイヤー削除処理を実行
 *               Execute layer deletion process
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

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: IInstance<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const externalTimeline = new ExternalTimeline(workSpace, movieClip);
    await externalTimeline.deleteLayer(
        [message.data[2] as NonNullable<number>], // index
        true
    );
};