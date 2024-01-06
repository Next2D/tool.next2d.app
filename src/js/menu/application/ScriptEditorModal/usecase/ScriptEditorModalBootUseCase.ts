import { execute as scriptEditorModalUpdateTitleService } from "../service/ScriptEditorModalUpdateTitleService";
import {
    $getAceEditor,
    $getTargetFrame,
    $getTargetMovieClip
} from "../ScriptEditorModalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description スクリプトエディタの起動関数
 *              Script editor startup function
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

    // 対象のMovieClipとフレーム番号をタイトルに表示
    const frame = $getTargetFrame();
    scriptEditorModalUpdateTitleService(movieClip.name, frame);

    // 既存のスクリプトがあればセット
    if (movieClip.hasAction(frame)) {
        $getAceEditor().setValue(movieClip.getAction(frame), -1);
    }

    // 入力モードをonにする
    $updateKeyLock(true);

    // フォーカスをセット
    $getAceEditor().focus();
};