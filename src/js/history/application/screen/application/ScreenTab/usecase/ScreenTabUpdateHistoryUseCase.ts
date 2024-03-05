import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $SCREEN_TAB_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";
import { $useSocket } from "@/share/ShareUtil";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as screenTabCreateHistoryObjectService } from "../service/ScreenTabCreateHistoryObjectService";

/**
 * @description プロジェクト名の変更を作業履歴に登録
 *              Register project name changes in work history
 *
 * @param  {WorkSpace} work_space
 * @param  {string} name
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    name: string,
    receiver: boolean = false
): void => {

    // 指定のプロジェクトで起動中のMovieClipをセット
    const scene = work_space.scene;

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // 追加したLayer Objectを履歴に登録
    // fixed logic
    const historyObject = screenTabCreateHistoryObjectService(
        work_space.id,
        scene.id,
        work_space.name,
        name
    );

    // 作業履歴にElementを追加
    // fixed logic
    historyAddElementUseCase(
        scene.id,
        work_space.historyIndex,
        historyGetTextService($SCREEN_TAB_NAME_UPDATE_COMMAND),
        "",
        ...historyObject.args
    );

    // fixed logic
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};