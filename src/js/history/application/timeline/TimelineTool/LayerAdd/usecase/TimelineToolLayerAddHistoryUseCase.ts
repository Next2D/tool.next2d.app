import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAD } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";

/**
 * @description 新規レイヤー追加の履歴を登録
 *              Register history of adding new layers
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // ポジション位置から未来の履歴を全て削除
    historyRemoveElementService();

    const workSpace = $getCurrentWorkSpace();

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        workSpace.historyIndex,
        historyGetTextService($TIMELINE_TOOL_LAYER_ADD_COMMAD)
    );

    const scene = workSpace.scene;
    const index = scene.layers.indexOf(layer as NonNullable<Layer>);

    // 追加したLayer Objectを履歴に登録
    workSpace.addHistory({
        "command": $TIMELINE_TOOL_LAYER_ADD_COMMAD,
        "undo": (): void =>
        {
            timelineToolLayerAddHistoryUndoUseCase(layer);
        },
        "redo": (): void =>
        {
            timelineToolLayerAddHistoryRedoUseCase(layer, index);
        }
    });
};