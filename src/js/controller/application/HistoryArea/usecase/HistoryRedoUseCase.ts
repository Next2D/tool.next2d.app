import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
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
 * @return {Promise<boolean>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    receiver: boolean = false
): Promise<boolean> => {

    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return false;
    }

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace || workSpace.historyIndex >= workSpace.histories.length) {
        return false;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return false;
    }

    const node: HTMLElement | undefined = element.children[workSpace.historyIndex] as HTMLElement;
    if (!node) {
        return false;
    }

    // 履歴表示をアクティブに更新
    node.setAttribute("class", "");

    const historyObject: IHistoryObject | undefined = workSpace.histories[workSpace.historyIndex++];
    if (!historyObject) {
        return false;
    }

    await historyRedoCommandUseCase(historyObject);

    // 受け取り処理ではなく、画面共有していればUndoを送信
    if (!receiver && $useSocket()) {
        shareSendService({
            "command": $HISTORY_REDO_COMMAND,
            "messages": [workSpace.id, movieClip.id],
            "args": []
        });
    }

    return true;
};