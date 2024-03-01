import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";
import { execute as timelineSceneListClearAddRootUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListClearAddRootUseCase";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description ダブルタップ用の待機フラグのタイマー起動ID
 *              Timer activation ID for standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let activeTimerId: NodeJS.Timeout;

/**
 * @description 親Elementのマウスダウン処理関数
 *              Mouse down processing function of the parent Element
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

    // メニューを全て非表示にする
    $allHideMenu();

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        activeTimerId = setTimeout((): void =>
        {
            wait = false;
        }, 300);

    } else {

        // ダブルタップを終了
        wait = false;

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // ダブルタップ処理を実行
        const element = event.currentTarget as HTMLElement;
        if (!element) {
            return ;
        }

        const libraryId = parseInt(element.dataset.libraryId as string);
        const workSpace = $getCurrentWorkSpace();

        // 現在、起動中のMovieClipであればスキップ
        if (workSpace.scene.id === libraryId) {
            return ;
        }

        const instance = workSpace.getLibrary(libraryId);
        if (!instance || instance.type !== "container") {
            return ;
        }

        // タイムラインのシーン名を初期化してrootを追加
        timelineSceneListClearAddRootUseCase();

        const externalWorkSpace = new ExternalWorkSpace(workSpace);
        externalWorkSpace.runMovieClip(instance);
    }
};