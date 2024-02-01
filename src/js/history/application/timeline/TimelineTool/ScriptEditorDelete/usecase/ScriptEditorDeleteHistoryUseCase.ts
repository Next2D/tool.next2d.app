import { $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as scriptEditorDeleteHistoryUndoUseCase } from "./ScriptEditorDeleteHistoryUndoUseCase";
import { execute as scriptEditorDeleteHistoryRedoUseCase } from "./ScriptEditorDeleteHistoryRedoUseCase";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description スクリプトの削除履歴を登録
 *              Register script deletion history
 *
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, frame: number): void =>
{
    // fixed logic
    if ($getCurrentWorkSpace().scene.id === movie_clip.id) {

        // ポジション位置から未来の履歴を全て削除
        historyRemoveElementService(movie_clip);

        // 作業履歴にElementを追加
        historyAddElementUseCase(
            movie_clip.historyIndex,
            historyGetTextService($TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND)
        );
    }

    // 編集前のスクリプトをセット
    const beforeScript = movie_clip.getAction(frame);

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory({
        "command": $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
        "undo": (): void =>
        {
            scriptEditorDeleteHistoryUndoUseCase(frame, beforeScript);
        },
        "redo": (): void =>
        {
            scriptEditorDeleteHistoryRedoUseCase(frame);
        }
    });
};