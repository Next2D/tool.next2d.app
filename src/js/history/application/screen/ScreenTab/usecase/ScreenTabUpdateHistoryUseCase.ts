import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as screenTabNameAddHistoryRedoUseCase } from "./ScreenTabNameAddHistoryRedoUseCase";
import { execute as screenTabNameAddHistoryUndoUseCase } from "./ScreenTabNameAddHistoryUndoUseCase";
import { $SCREEN_TAB_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description プロジェクト名の変更を作業履歴に登録
 *              Register project name changes in work history
 *
 * @param  {WorkSpace} work_space
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace, name: string): void =>
{
    // 指定のプロジェクトで起動中のMovieClipをセット
    const scene = work_space.scene;

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(scene);

    // fixed logic
    // 作業履歴にElementを追加
    historyAddElementUseCase(
        scene.historyIndex,
        historyGetTextService($SCREEN_TAB_NAME_UPDATE_COMMAND)
    );

    const beforeName = work_space.name;

    // 追加したLayer Objectを履歴に登録
    scene.addHistory({
        "command": $SCREEN_TAB_NAME_UPDATE_COMMAND,
        "undo": (): void =>
        {
            screenTabNameAddHistoryUndoUseCase(work_space, beforeName);
        },
        "redo": (): void =>
        {
            screenTabNameAddHistoryRedoUseCase(work_space, name);
        }
    });
};