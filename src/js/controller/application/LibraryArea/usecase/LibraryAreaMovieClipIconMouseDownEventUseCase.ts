import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineSceneListClearAddRootUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListClearAddRootUseCase";
import { execute as externalTimelineEditMovieClipUseService } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
 * @description MovieClipアイコンのダブルタップ処理関数
 *              Double-tap processing function for MovieClip icons
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
    ) {
        return ;
    }

    // ダブルタップ処理
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    if ($useKeyboard()) {
        $setEditingElement(null);
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示
    $allHideMenu();

    const libraryId = parseInt(element.dataset.libraryId as string);
    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ライブラリIDをセット
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
        const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
        if (!movieClip) {
            return ;
        }

        // タイムラインのシーン名を初期化してrootを追加
        timelineSceneListClearAddRootUseCase();

        // 指定のMovieClipを起動
        await externalTimelineEditMovieClipUseService(workSpace, movieClip);
    }
};