import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import {
    $getAceEditor,
    $getTargetFrame,
    $getTargetMovieClip
} from "../ScriptEditorModalUtil";

/**
 * @description スクリプトエディタを閉じる時に情報を保存する
 *              Save information when closing the script editor
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const movieClip = $getTargetMovieClip();
    if (!movieClip) {
        return ;
    }

    const editor = $getAceEditor();
    const script = editor.getValue().trim();
    const frame  = $getTargetFrame();

    // エディタの値を初期化
    editor.setValue("");

    // 入力モードをoffにする
    $updateKeyLock(false);

    // 外部APIを起動
    const externalMovieClip = new ExternalMovieClip($getCurrentWorkSpace(), movieClip);
    await externalMovieClip.setAction(frame, script);
};