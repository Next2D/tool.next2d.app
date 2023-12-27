import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_TOOL_LAYER_DELETE_COMMAD } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as timelineToolLayerDeleteHistoryRedoUseCase } from "./TimelineToolLayerDeleteHistoryRedoUseCase";
import { execute as timelineToolLayerDeleteHistoryUndoUseCase } from "./TimelineToolLayerDeleteHistoryUndoUseCase";

/**
 * @description 指定のレイヤーを削除
 *              Delete specified layer
 *
 * @param  {Layer} layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, index: number): void =>
{
    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService();

    const workSpace = $getCurrentWorkSpace();

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        workSpace.historyIndex,
        historyGetTextService($TIMELINE_TOOL_LAYER_DELETE_COMMAD)
    );

    // 追加したLayer Objectを履歴に登録
    workSpace.addHistory({
        "command": $TIMELINE_TOOL_LAYER_DELETE_COMMAD,
        "undo": (): void =>
        {
            timelineToolLayerDeleteHistoryUndoUseCase(layer, index);
        },
        "redo": (): void =>
        {
            timelineToolLayerDeleteHistoryRedoUseCase(layer);
        }
    });
};