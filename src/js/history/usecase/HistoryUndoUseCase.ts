import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $useSocket } from "@/share/application/ShareUtil";
import { execute as shareSendUseCase } from "@/share/application/usecase/ShareSendUseCase";
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

    const scene: InstanceImpl<MovieClip> = workSpace.getLibrary(library_id);
    if (!scene || !scene.historyIndex) {
        return ;
    }

    const historyObject: HistoryObjectImpl | undefined = scene.histories[--scene.historyIndex];
    if (!historyObject) {
        return ;
    }

    const node: HTMLElement | undefined = element.children[scene.historyIndex] as HTMLElement;
    if (!node) {
        return ;
    }

    // 履歴表示を非アクティブにする
    node.setAttribute("class", "disable");

    // undoを実行
    historyObject.undo();

    // 受け取り処理ではなく、画面共有していればUndoを送信
    if (!receiver && $useSocket()) {
        shareSendUseCase(
            $HISTORY_UNDO_COMMAND,
            [workSpace.id, scene.id]
        );
    }
};