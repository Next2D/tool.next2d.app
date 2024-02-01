import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as scriptEditorModalShowService } from "@/menu/application/ScriptEditorModal/service/ScriptEditorModalShowService";
import {
    $setTargetFrame,
    $setTargetMovieClip
} from "@/menu/application/ScriptEditorModal/ScriptEditorModalUtil";

/**
 * @description フレームのElementのマウスダウン処理関数
 *              Mouse down processing function for Element of frame
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const libraryId = parseInt(element.dataset.libraryId as string);
    const movieClip = workSpace.getLibrary(libraryId);

    // MovieClipでなければ終了
    if (movieClip.type !== "container") {
        return ;
    }

    // 対象のMovieClipをセット
    $setTargetMovieClip(movieClip);

    // 対象のフレームをセット
    const frame = parseInt(element.dataset.frame as string);
    $setTargetFrame(frame);

    // スクリプトエディタを起動
    scriptEditorModalShowService();
};