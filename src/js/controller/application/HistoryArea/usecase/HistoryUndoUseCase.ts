import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as historyUndoCommandUseCase } from "./HistoryUndoCommandUseCase";
import {
    $HISTORY_LIST_ID,
    $HISTORY_UNDO_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description 作業履歴のポジションを一つ過去に戻す
 *              Move back one position in the work history to the past.
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

    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(library_id);
    if (!movieClip || !workSpace.historyIndex) {
        return ;
    }

    const historyObject: HistoryObjectImpl | undefined = workSpace.histories[--workSpace.historyIndex];
    if (!historyObject) {
        return ;
    }

    const node: HTMLElement | undefined = element.children[workSpace.historyIndex] as HTMLElement;
    if (!node) {
        return ;
    }

    // 履歴表示を非アクティブにする
    node.setAttribute("class", "disable");

    // undoを実行
    historyUndoCommandUseCase(historyObject);

    // 受け取り処理ではなく、画面共有していればUndoを送信
    if (!receiver && $useSocket()) {
        shareSendService({
            "command": $HISTORY_UNDO_COMMAND,
            "messages": [workSpace.id, movieClip.id],
            "args": []
        });
    }
};