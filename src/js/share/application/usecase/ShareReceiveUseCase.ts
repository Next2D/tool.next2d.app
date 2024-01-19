import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { execute as workSpaceReceiveUpdateNameUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceReceiveUpdateNameUseCase";
import { execute as historyRedoUseCase } from "@/history/usecase/HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "@/history/usecase/HistoryUndoUseCase";
import {
    $HISTORY_REDO_COMMAND,
    $HISTORY_UNDO_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description 共有者からの作業履歴の受け取り
 *              Receive work history from co-owners
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    switch (message.historyCommand) {

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            workSpaceReceiveUpdateNameUseCase(message);
            break;

        case $HISTORY_UNDO_COMMAND:
            historyUndoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>
            );
            break;

        case $HISTORY_REDO_COMMAND:
            historyRedoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>
            );
            break;

        default:
            break;

    }
};