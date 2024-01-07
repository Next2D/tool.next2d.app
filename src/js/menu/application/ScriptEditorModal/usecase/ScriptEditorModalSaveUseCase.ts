import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { execute as scriptEditorNewRegisterHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUseCase";
import { execute as scriptEditorUpdateHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryUseCase";
import { execute as scriptEditorDeleteHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryUseCase";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";
import {
    $getAceEditor,
    $getTargetFrame,
    $getTargetMovieClip
} from "../ScriptEditorModalUtil";
import { $TIMELINE_HEADER_ID } from "@/config/TimelineConfig";

/**
 * @description スクリプトエディタを閉じる時に情報を保存する
 *              Save information when closing the script editor
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const movieClip = $getTargetMovieClip();
    if (!movieClip) {
        return ;
    }

    // 入力モードをoffにする
    $updateKeyLock(false);

    const editor = $getAceEditor();
    const script = editor.getValue().trim();

    // 対象のMovieClipにスクリプトを保存
    const frame = $getTargetFrame();
    if (script) {

        // 作業履歴を残す
        if (!movieClip.hasAction(frame)) {
            // 初回登録履歴を登録
            scriptEditorNewRegisterHistoryUseCase(movieClip, frame, script);
        } else {
            const beforeScript = movieClip.getAction(frame);

            // 編集履歴を登録
            if (beforeScript !== script) {
                scriptEditorUpdateHistoryUseCase(movieClip, frame, script);
            }
        }

        // 上書き
        movieClip.setAction(frame, script);
    } else {

        // 削除履歴を登録
        scriptEditorDeleteHistoryUseCase(movieClip, frame);

        // スクリプトを削除
        movieClip.deleteAction(frame);
    }

    // 初期化
    editor.setValue("");

    // 表示領域にElementがあればclassを更新
    const scene = $getCurrentWorkSpace().scene;
    if (scene.id === movieClip.id
        && $getLeftFrame() <= frame
        && $getRightFrame() >= frame
    ) {
        const element: HTMLElement | null = document
            .getElementById($TIMELINE_HEADER_ID);

        if (!element) {
            return ;
        }

        const node = element.children[frame - $getLeftFrame()] as HTMLElement;
        if (!node) {
            return ;
        }

        // スクリプトアイコンの更新
        timelineHeaderUpdateScriptElementService(node, frame);
    }
};