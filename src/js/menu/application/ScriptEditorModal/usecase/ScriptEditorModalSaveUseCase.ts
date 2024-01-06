import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
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
        movieClip.setAction(frame, script);
    } else {
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