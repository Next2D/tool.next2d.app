import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $useSocket } from "@/share/application/ShareUtil";
import { execute as shareSendService } from "@/share/application/service/ShareSendService";
import { execute as historyRedoCommandUseCase } from "./HistoryRedoCommandUseCase";
import {
    $HISTORY_LIST_ID,
    $HISTORY_REDO_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description 作業履歴のポジションを一つ未来に進める
 *              Advance one work history position into the future.
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    receiver: boolean = false
): void => {

    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const scene: InstanceImpl<MovieClip> = workSpace.getLibrary(library_id);
    if (!scene || !scene.histories.length) {
        return ;
    }

    const node: HTMLElement | undefined = element.children[scene.historyIndex] as HTMLElement;
    if (!node) {
        return ;
    }

    // 履歴表示をアクティブに更新
    node.setAttribute("class", "");

    const historyObject: HistoryObjectImpl | undefined = scene.histories[scene.historyIndex++];
    if (!historyObject) {
        return ;
    }

    historyRedoCommandUseCase(historyObject);

    // 受け取り処理ではなく、画面共有していればUndoを送信
    if (!receiver && $useSocket()) {
        shareSendService(
            $HISTORY_REDO_COMMAND,
            [workSpace.id, scene.id]
        );
    }
};