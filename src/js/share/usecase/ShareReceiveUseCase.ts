import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { execute as workSpaceUpdateNameReceiveUseCase } from "@/share/receive/application/core/application/WorkSpace/usecase/WorkSpaceUpdateNameReceiveUseCase";
import { execute as timelineToolLayerAddReceiveService } from "@/share/receive/application/timeline/application/TimelineTool/application/LayerAdd/service/TimelineToolLayerAddReceiveService";
import { execute as timelineToolLayerDeleteReceiveService } from "@/share/receive/application/timeline/application/TimelineTool/application/LayerDelete/service/TimelineToolLayerDeleteReceiveService";
import { execute as timelineLayerControllerLayerNameUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerNameUpdateReceiveUseCase";
import { execute as timelineLayerControllerLayerLockUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerLockUpdateReceiveUseCase";
import { execute as timelineLayerControllerLayerDisableUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerDisableUpdateReceiveUseCase";
import { execute as timelineLayerControllerLayerLightUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerLightUpdateReceiveUseCase";
import { execute as historyRedoUseCase } from "@/history/usecase/HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "@/history/usecase/HistoryUndoUseCase";
import {
    $HISTORY_REDO_COMMAND,
    $HISTORY_UNDO_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND,
    $LAYER_LOCK_UPDATE_COMMAND,
    $LAYER_DISABLE_UPDATE_COMMAND,
    $LAYER_LIGHT_UPDATE_COMMAND
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
            workSpaceUpdateNameReceiveUseCase(message);
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddReceiveService(message);
            break;

        // 新規レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteReceiveService(message);
            break;

        // レイヤー名の変更
        case $LAYER_NAME_UPDATE_COMMAND:
            timelineLayerControllerLayerNameUpdateReceiveUseCase(message);
            break;

        // レイヤーのロックを更新
        case $LAYER_LOCK_UPDATE_COMMAND:
            timelineLayerControllerLayerLockUpdateReceiveUseCase(message);
            break;

        // レイヤー表示を更新
        case $LAYER_DISABLE_UPDATE_COMMAND:
            timelineLayerControllerLayerDisableUpdateReceiveUseCase(message);
            break;

        // レイヤーハイライトを更新
        case $LAYER_LIGHT_UPDATE_COMMAND:
            timelineLayerControllerLayerLightUpdateReceiveUseCase(message);
            break;

        default:
            break;

    }
};