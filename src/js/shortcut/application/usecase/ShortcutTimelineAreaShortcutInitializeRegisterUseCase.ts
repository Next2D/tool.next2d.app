import { execute as timelineToolLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolLayerAddUseCase";
import { execute as timelineLayerArrowDownUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerArrowDownUseCase";
import { execute as timelineLayerArrowUpUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerArrowUpUseCase";
import { execute as timelineToolLayerDeleteUseCase } from "@/timeline/application/TimelineTool/application/LayerDelete/usecase/TimelineToolLayerDeleteUseCase";
import { execute as scriptEditorModalCurrentBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalCurrentBootUseCase";
import { execute as timelineToolAddEmptyKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddEmptyKeyFrame/usecase/TimelineToolAddEmptyKeyFrameUseCase";
import { execute as timelineToolInsertFramesUseCase } from "@/timeline/application/TimelineTool/application/InsertFrames/usecase/TimelineToolInsertFramesUseCase";
import { execute as timelineToolAddKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddKeyFrame/usecase/TimelineToolAddKeyFrameUseCase";
import { execute as timelineToolDeleteFramesUseCase } from "@/timeline/application/TimelineTool/application/EraseFrames/usecase/TimelineToolEraseFramesUseCase";
import {
    $generateShortcutKey,
    $setShortcut
} from "@/shortcut/ShortcutUtil";

/**
 * @description タイムラインエリアのショートカットイベントを登録
 *              Register shortcut events in the timeline area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 新規レイヤー追加
    $setShortcut(
        $generateShortcutKey("+", { "ctrl": true }),
        timelineToolLayerAddUseCase
    );
    $setShortcut(
        $generateShortcutKey(";", { "ctrl": true }),
        timelineToolLayerAddUseCase
    );

    // レイヤー移動
    $setShortcut(
        $generateShortcutKey("ArrowUp", { "ctrl": true }),
        timelineLayerArrowUpUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowDown", { "ctrl": true }),
        timelineLayerArrowDownUseCase
    );

    // レイヤー削除
    $setShortcut(
        $generateShortcutKey("Backspace", { "ctrl": true }),
        timelineToolLayerDeleteUseCase
    );
    $setShortcut(
        $generateShortcutKey("Delete", { "ctrl": true }),
        timelineToolLayerDeleteUseCase
    );

    // スクリプトエディタの起動
    $setShortcut($generateShortcutKey("s"),
        scriptEditorModalCurrentBootUseCase
    );

    // 空のキーフレーム追加
    $setShortcut(
        $generateShortcutKey("e", { "ctrl": true }),
        timelineToolAddEmptyKeyFrameUseCase
    );

    // フレーム追加
    $setShortcut(
        $generateShortcutKey("f"),
        timelineToolInsertFramesUseCase
    );

    // キーフレーム追加
    $setShortcut(
        $generateShortcutKey("k"),
        timelineToolAddKeyFrameUseCase
    );

    // フレームを削除
    $setShortcut(
        $generateShortcutKey("f", { "ctrl": true }),
        timelineToolDeleteFramesUseCase
    );
};