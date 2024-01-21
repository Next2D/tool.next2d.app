import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { execute as workSpaceReceiveUpdateNameUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceReceiveUpdateNameUseCase";
import { execute as timelineToolReceiveLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolReceiveLayerAddUseCase";
import { execute as historyRedoUseCase } from "@/history/usecase/HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "@/history/usecase/HistoryUndoUseCase";
import {
    $HISTORY_REDO_COMMAND,
    $HISTORY_UNDO_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND
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

        // Undo処理
        case $HISTORY_UNDO_COMMAND:
            historyUndoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>,
                true
            );
            break;

        // Redo処理
        case $HISTORY_REDO_COMMAND:
            historyRedoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>,
                true
            );
            break;

        // タブ名の変更
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            workSpaceReceiveUpdateNameUseCase(message);
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolReceiveLayerAddUseCase(message);
            break;

        default:
            break;

    }
};