import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { execute as screenTabNameAddHistoryRedoUseCase } from "../application/screen/ScreenTab/usecase/ScreenTabNameAddHistoryRedoUseCase";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "../application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import { execute as timelineToolLayerDeleteHistoryRedoUseCase } from "../application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryRedoUseCase";
import {
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description Redoコマンドの実行関数
 *              Execution function of the Redo command
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (history_object: HistoryObjectImpl): void =>
{
    const args = history_object.args;
    switch (history_object.command) {

        // タブ名の変更
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            screenTabNameAddHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[2] as string  // afterName
            );
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as string, // Layer Name
                args[3] as number, // Layer index
                args[4] as string  // Layer Color
            );
            break;

        // レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[3] as number  // Layer index
            );
            break;

        default:
            break;

    }
};