import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_TOOL_LAYER_DELETE_COMMAND } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as timelineToolLayerDeleteHistoryRedoUseCase } from "./TimelineToolLayerDeleteHistoryRedoUseCase";
import { execute as timelineToolLayerDeleteHistoryUndoUseCase } from "./TimelineToolLayerDeleteHistoryUndoUseCase";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定のレイヤーの削除履歴と登録
 *              Deletion history and registration of the specified layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, layer: Layer, index: number): void =>
{
    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(movie_clip);

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        movie_clip.historyIndex,
        historyGetTextService($TIMELINE_TOOL_LAYER_DELETE_COMMAND)
    );

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory({
        "command": $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
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