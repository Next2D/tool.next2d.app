import { execute as scriptEditorModalUpdateTitleService } from "../service/ScriptEditorModalUpdateTitleService";
import {
    $getAceEditor,
    $getTargetFrame,
    $getTargetMovieClip
} from "../ScriptEditorModalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

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
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

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