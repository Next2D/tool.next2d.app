import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";

/**
 * @description 新規レイヤー追加の履歴を登録
 *              Register history of adding new layers
 *
 * @param  {Layer} layer
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, movie_clip: MovieClip): void =>
{
    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService();

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        movie_clip.historyIndex,
        historyGetTextService($TIMELINE_TOOL_LAYER_ADD_COMMAND)
    );

    const index = movie_clip.layers.indexOf(layer as NonNullable<Layer>);

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory({
        "command": $TIMELINE_TOOL_LAYER_ADD_COMMAND,
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