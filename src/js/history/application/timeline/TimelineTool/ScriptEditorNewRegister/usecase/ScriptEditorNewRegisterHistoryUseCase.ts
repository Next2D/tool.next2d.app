import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as scriptEditorNewRegisterCreateHistoryObjectService } from "../service/ScriptEditorNewRegisterCreateHistoryObjectService";

/**
 * @description スクリプトの新規登録を削除
 *              Delete specified layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} script
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    script: string,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(movie_clip);

    // fixed logic
    if (work_space.active === movie_clip.active) {

        // 作業履歴にElementを追加
        // fixed logic
        historyAddElementUseCase(
            movie_clip.historyIndex,
            historyGetTextService($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND)
        );

    }

    const historyObject = scriptEditorNewRegisterCreateHistoryObjectService(
        work_space.id, movie_clip.id, frame, script
    );

    // Objectを履歴に登録
    movie_clip.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};