import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as scriptEditorNewRegisterHistoryUndoUseCase } from "./ScriptEditorNewRegisterHistoryUndoUseCase";
import { execute as scriptEditorNewRegisterHistoryRedoUseCase } from "./ScriptEditorNewRegisterHistoryRedoUseCase";

/**
 * @description スクリプトの新規登録を削除
 *              Delete specified layer
 *
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number, script: string): void =>
{
    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService();

    const scene = $getCurrentWorkSpace().scene;

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        scene.historyIndex,
        historyGetTextService($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND)
    );

    // 追加したLayer Objectを履歴に登録
    scene.addHistory({
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