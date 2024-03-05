import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as timelineLayerControllerLayerNameUpdateCreateHistoryObjectService } from "../service/TimelineLayerControllerLayerNameUpdateCreateHistoryObjectService";
import { $LAYER_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";

/**
 * @description 新規レイヤー追加の履歴を登録
 *              Register history of adding new layers
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} name
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    name: string,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    const index = movie_clip.layers.indexOf(layer);

    // fixed logic
    const historyObject = timelineLayerControllerLayerNameUpdateCreateHistoryObjectService(
        work_space.id, movie_clip, index, layer.name, name
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active && movie_clip.actions) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($LAYER_NAME_UPDATE_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    // fixed logic
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};