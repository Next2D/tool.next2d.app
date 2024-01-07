import { $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as scriptEditorUpdateHistoryUndoUseCase } from "./ScriptEditorUpdateHistoryUndoUseCase";
import { execute as scriptEditorUpdateHistoryRedoUseCase } from "./ScriptEditorUpdateHistoryRedoUseCase";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description スクリプトの変更履歴を登録
 *              Register script change history
 *
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
        historyRemoveElementService();

        // 作業履歴にElementを追加
        historyAddElementUseCase(
            movie_clip.historyIndex,
            historyGetTextService($TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND)
        );
    }

    // 編集前のスクリプトをセット
    const beforeScript = movie_clip.getAction(frame);

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory({
        "command": $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
        "undo": (): void =>
        {
            scriptEditorUpdateHistoryUndoUseCase(frame, beforeScript);
        },
        "redo": (): void =>
        {
            scriptEditorUpdateHistoryRedoUseCase(frame, script);
        }
    });
};