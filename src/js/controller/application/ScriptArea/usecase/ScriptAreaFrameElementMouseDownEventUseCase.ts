import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as scriptEditorModalShowService } from "@/menu/application/ScriptEditorModal/service/ScriptEditorModalShowService";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 全てのメニューを非表示にする
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const libraryId = parseInt(element.dataset.libraryId as string);
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;

    // MovieClipでなければ終了
    if (!movieClip || movieClip.type !== $MOVIE_CLIP_TYPE) {
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