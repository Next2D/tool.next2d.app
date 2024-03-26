import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $useSocket } from "@/share/ShareUtil";
import { $LAYER_UPDATE_MODE_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as layerUpdateModeCreateHistoryObjectService } from "../service/LayerUpdateModeCreateHistoryObjectService";
import { execute as externalLayerGetLayerTypeService } from "@/external/core/application/ExternalLayer/service/ExternalLayerGetLayerTypeService";
import { execute as shareSendService } from "@/share/service/ShareSendService";

/**
 * @description レイヤーモードを更新
 *              Update layer mode
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} before_mode
 * @param  {number} before_parent_id
 * @param  {array} indexes
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    before_mode: number,
    before_parent_id: number,
    indexes: number[],
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // fixed logic
    const historyObject = layerUpdateModeCreateHistoryObjectService(
        work_space.id, movie_clip, layer,
        before_mode, before_parent_id, indexes,
        externalLayerGetLayerTypeService(layer.mode)
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($LAYER_UPDATE_MODE_COMMAND),
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