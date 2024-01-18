import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as scriptEditorNewRegisterHistoryUndoUseCase } from "./ScriptEditorNewRegisterHistoryUndoUseCase";
import { execute as scriptEditorNewRegisterHistoryRedoUseCase } from "./ScriptEditorNewRegisterHistoryRedoUseCase";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description スクリプトの新規登録を削除
 *              Delete specified layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, frame: number, script: string): void =>
{
    // fixed logic
    if ($getCurrentWorkSpace().scene.id === movie_clip.id) {

        // ポジション位置から未来の履歴を全て削除
        // fixed logic
        historyRemoveElementService(movie_clip);

        // 作業履歴にElementを追加
        // fixed logic
        historyAddElementUseCase(
            movie_clip.historyIndex,
            historyGetTextService($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND)
        );

    }

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory({
        "command": $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
        "undo": (): void =>
        {
            scriptEditorNewRegisterHistoryUndoUseCase(frame);
        },
        "redo": (): void =>
        {
            scriptEditorNewRegisterHistoryRedoUseCase(frame, script);
        }
    });
};