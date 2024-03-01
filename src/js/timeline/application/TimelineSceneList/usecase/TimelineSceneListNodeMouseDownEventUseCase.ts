import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import { execute as sceneListMenuHideService } from "@/menu/application/SceneListMenu/service/SceneListMenuHideService";

/**
 * @description タイムラインのシーン名のマウスダウンのイベント処理関数
 *              Event handling function for mouse down of a scene name in the timeline
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // メニューを非表示にする
    sceneListMenuHideService();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のMovieClipを取得
    const workSpace = $getCurrentWorkSpace();
    const libraryId = parseInt(element.dataset.libraryId as string);
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip || movieClip.type !== "container") {
        return ;
    }

    // 指定のMovieClipを起動
    const externalWorkSpace = new ExternalWorkSpace(workSpace);
    externalWorkSpace.runMovieClip(new ExternalMovieClip(
        workSpace, movieClip
    ));
};