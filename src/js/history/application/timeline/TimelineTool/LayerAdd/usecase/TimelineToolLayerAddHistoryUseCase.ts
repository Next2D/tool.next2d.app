import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as timelineToolLayerAddCreateHistoryObjectService } from "../service/TimelineToolLayerAddCreateHistoryObjectService";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $useSocket } from "@/share/application/ShareUtil";
import { execute as shareSendService } from "@/share/application/service/ShareSendService";

/**
 * @description 新規レイヤー追加の履歴を登録
 *              Register history of adding new layers
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(movie_clip);

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        movie_clip.historyIndex,
        historyGetTextService($TIMELINE_TOOL_LAYER_ADD_COMMAND)
    );

    const index = movie_clip.layers.indexOf(layer as NonNullable<Layer>);

    const historyObject = timelineToolLayerAddCreateHistoryObjectService(
        work_space.id, movie_clip.id, layer, index
    );

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};