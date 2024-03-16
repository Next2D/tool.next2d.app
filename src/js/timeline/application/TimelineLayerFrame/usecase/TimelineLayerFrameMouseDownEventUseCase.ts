import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerFrameSelectedStartUseCase } from "./TimelineLayerFrameSelectedStartUseCase";
import { execute as timelineLayerFrameActiveGroupUseCase } from "./TimelineLayerFrameActiveGroupUseCase";
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
 * @description ダブルタップ用の待機フラグのタイマー起動ID
 *              Timer activation ID for standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let activeTimerId: NodeJS.Timeout;

/**
 * @description フレームエリアのマウスダウンの実行関数
 *              Execution function of mouse down in frame area
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

    // フレーム情報を更新してマーカーを移動
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    // メニューを非表示にする
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

        const frame = parseInt(element.dataset.frame as NonNullable<string>);
        if (movieClip.selectedLayers.indexOf(layer) > -1
            && frame >= movieClip.selectedStartFrame
            && movieClip.selectedEndFrame > frame
        ) {

            // 選択したフレームグループの移動
            activeTimerId = setTimeout(timelineLayerFrameActiveGroupUseCase, 500);

        } else {

            // フレーム選択
            timelineLayerFrameSelectedStartUseCase(
                workSpace,
                movieClip,
                layer,
                frame
            );

        }

    } else {
        // ダブルタップを終了
        wait = false;

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // TODO 指定レイヤーのフレームレンジを全て選択状態に更新
    }
};