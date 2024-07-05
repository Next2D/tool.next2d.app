import { $getActiveTool } from "@/tool/application/ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { execute as timelineSceneListAddMovieClipUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListAddMovieClipUseCase";
import { execute as externalTimelineEditMovieClipUseService } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseService";

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
let timerId: NodeJS.Timeout;

/**
 * @description スクリーンに設置したBitmapのDisplayObjectのマウスダウンイベント処理関数
 *              Mouse down event processing function of DisplayObject of Bitmap placed on the screen
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();

    // 移動用のwindowイベントを登録
    const tool = $getActiveTool();
    if (!tool) {
        return ;
    }

    // タイマー予約をクリア
    clearTimeout(timerId);

    if (!wait) {
        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        timerId = setTimeout((): void =>
        {
            wait = false;
        }, 300);

        // タップイベントを発火
        tool.dispatchEvent(EventType.DISPLAY_OBJRCY, event);

    } else {

        // ダブルタップを終了
        wait = false;

        const element = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        const workSpace = $getCurrentWorkSpace();
        const scene = workSpace.scene;

        const layerId = parseInt(element.dataset.layerId as string);
        const layer = scene.getLayerById(layerId);
        if (!layer) {
            return ;
        }

        const depth = parseInt(element.dataset.depth as string);
        const character = layer.getCharacter(scene.currentFrame, depth);
        if (!character) {
            return ;
        }

        const movieClip = workSpace.getLibrary(character.libraryId);
        if (!movieClip || movieClip.type !== $MOVIE_CLIP_TYPE) {
            return ;
        }

        // タイムラインのシーン一覧に追加
        timelineSceneListAddMovieClipUseCase(scene);

        // 指定のMovieClipを起動
        await externalTimelineEditMovieClipUseService(workSpace, movieClip);
    }
};