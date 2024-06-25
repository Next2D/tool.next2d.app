import { execute as timelineToolLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolLayerAddUseCase";
import { execute as timelineLayerArrowDownUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerArrowDownUseCase";
import { execute as timelineLayerArrowUpUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerArrowUpUseCase";
import { execute as timelineToolLayerDeleteUseCase } from "@/timeline/application/TimelineTool/application/LayerDelete/usecase/TimelineToolLayerDeleteUseCase";
import { execute as scriptEditorModalCurrentBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalCurrentBootUseCase";
import { execute as timelineToolAddEmptyKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddEmptyKeyFrame/usecase/TimelineToolAddEmptyKeyFrameUseCase";
import { execute as timelineToolInsertFramesUseCase } from "@/timeline/application/TimelineTool/application/InsertFrames/usecase/TimelineToolInsertFramesUseCase";
import { execute as timelineToolAddKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddKeyFrame/usecase/TimelineToolAddKeyFrameUseCase";
import { execute as timelineToolEraseFramesUseCase } from "@/timeline/application/TimelineTool/application/EraseFrames/usecase/TimelineToolEraseFramesUseCase";
import { execute as timelineToolDeleteKeyframeUseCase } from "@/timeline/application/TimelineTool/application/DeleteKeyframe/usecase/TimelineToolDeleteKeyframeUseCase";
import { execute as timelineToolRepeatUseCase } from "@/timeline/application/TimelineTool/application/Repeat/usecase/TimelineToolRepeatUseCase";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { execute as timelineMenuMoveLastFrameService } from "@/menu/application/TimelineMenu/service/TimelineMenuMoveLastFrameService";
import { execute as timelineMenuMoveFirstFrameService } from "@/menu/application/TimelineMenu/service/TimelineMenuMoveFirstFrameService";
import { execute as timelineMenuMoveNextKeyFrameService } from "@/menu/application/TimelineMenu/service/TimelineMenuMoveNextKeyFrameService";
import { execute as timelineMenuMovePrevKeyFrameService } from "@/menu/application/TimelineMenu/service/TimelineMenuMovePrevKeyFrameService";
import { execute as timelineLayerFrameMoveRightFrameService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameMoveRightFrameService";
import { execute as timelineLayerFrameMoveLeftFrameService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameMoveLeftFrameService";
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
        timelineToolEraseFramesUseCase
    );

    // キーフレームを削除
    $setShortcut(
        $generateShortcutKey("k", { "ctrl": true }),
        timelineToolDeleteKeyframeUseCase
    );

    // ループ設定
    $setShortcut(
        $generateShortcutKey("l", { "ctrl": true, "shift": true }),
        timelineToolRepeatUseCase
    );

    // 再生・停止を実行
    $setShortcut(
        $generateShortcutKey("Enter"),
        timelineToolPlayStopUseCase
    );

    // 指定レイヤーの最後のフレームに移動
    $setShortcut(
        $generateShortcutKey("ArrowRight", { "ctrl": true, "shift": true }),
        timelineMenuMoveLastFrameService
    );

    // 指定レイヤーの1フレームに移動
    $setShortcut(
        $generateShortcutKey("ArrowLeft", { "ctrl": true, "shift": true }),
        timelineMenuMoveFirstFrameService
    );

    // 指定レイヤーの次のキーフレームに移動
    $setShortcut(
        $generateShortcutKey("ArrowRight", { "alt": true }),
        timelineMenuMoveNextKeyFrameService
    );

    // 指定レイヤーの前のキーフレームに移動
    $setShortcut(
        $generateShortcutKey("ArrowLeft", { "alt": true }),
        timelineMenuMovePrevKeyFrameService
    );

    // 1フレーム右へ移動
    $setShortcut(
        $generateShortcutKey("ArrowRight", { "ctrl": true }),
        timelineLayerFrameMoveRightFrameService
    );

    // 1フレーム左へ移動
    $setShortcut(
        $generateShortcutKey("ArrowLeft", { "ctrl": true }),
        timelineLayerFrameMoveLeftFrameService
    );
};