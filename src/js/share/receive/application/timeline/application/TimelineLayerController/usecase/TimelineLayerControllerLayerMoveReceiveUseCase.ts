import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

/**
 * @description レイヤー移動を実行
 *              Perform layer movement
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

    const beforeIndex = message.data[2] as NonNullable<number>;
    const afterIndex  = message.data[3] as NonNullable<number>;

    // レイヤーを移動
    movieClip.layers.splice(afterIndex, 0, movieClip.layers.splice(beforeIndex, 1)[0]);

    // 履歴に登録
    timelineLayerControllerMoveLayerHistoryUseCase(
        workSpace,
        movieClip,
        beforeIndex,
        afterIndex,
        true
    );

    if (workSpace.active && movieClip.active) {
        // レイヤーの再描画
        timelineLayerBuildElementUseCase();
    }
};