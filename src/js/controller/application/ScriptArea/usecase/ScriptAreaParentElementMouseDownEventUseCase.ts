import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { execute as timelineSceneListClearAddRootUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListClearAddRootUseCase";
import { execute as timelineSceneListClearAllService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListClearAllService";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { execute as externalTimelineEditMovieClipUseService } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description 選択中のライブラリID
 *              Library ID currently selected
 *
 * @type {number}
 * @private
 */
let selectedLibraryId: number = -1;

/**
 * @description 親Elementのマウスダウン処理関数
 *              Mouse down processing function of the parent Element
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag
    ) {
        return ;
    }

    // ダブルタップ処理を実行
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    if ($useKeyboard()) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    const libraryId = parseInt(element.dataset.libraryId as string);
    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        selectedLibraryId = libraryId;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

    } else {

        // ダブルタップを終了
        wait = false;

        if (selectedLibraryId !== libraryId) {
            return ;
        }

        const workSpace = $getCurrentWorkSpace();

        // 現在、起動中のMovieClipであればスキップ
        if (workSpace.scene.id === libraryId) {
            return ;
        }

        const instance = workSpace.getLibrary(libraryId);
        if (!instance || instance.type !== $MOVIE_CLIP_TYPE) {
            return ;
        }

        // rootじゃない場合は、タイムラインのシーン名を初期化してrootを追加
        if (instance.id > 0) {
            timelineSceneListClearAddRootUseCase();
        } else {
            timelineSceneListClearAllService();
        }

        // 指定のMovieClipを起動
        await externalTimelineEditMovieClipUseService(workSpace, instance as MovieClip);
    }
};