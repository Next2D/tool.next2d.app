import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipCreateLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipCreateLayerUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";

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

    // レイヤの追加処理を実行
    const layer = externalMovieClipCreateLayerUseCase(
        workSpace,
        movieClip,
        message.data[2] as NonNullable<number>, // index
        message.data[3] as NonNullable<string>, // name
        message.data[4] as NonNullable<string> // color
    );

    if (!layer) {
        return ;
    }

    // 履歴を登録
    timelineToolLayerAddHistoryUseCase(
        workSpace, movieClip, layer, true
    );
};