import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameSelectedStartUseCase } from "./TimelineLayerFrameSelectedStartUseCase";
import { execute as timelineTargetGroupActiveGroupUseCase } from "@/timeline/application/TimelineTargetGroup/usecase/TimelineTargetGroupActiveGroupUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import {
    $getLayerFromElement,
    $getMouseState,
    $setMouseState
} from "../../TimelineUtil";

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
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
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

    // マウスダウン状態に変更
    $setMouseState("down");

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const frame = parseInt(element.dataset.frame as NonNullable<string>);

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

        if (movieClip.selectedLayers.indexOf(layer) > -1
            && frame >= movieClip.selectedStartFrame
            && movieClip.selectedEndFrame > frame
        ) {

            // 選択したフレームグループの移動
            activeTimerId = setTimeout((): void =>
            {
                if ($getMouseState() === "up") {
                    return ;
                }
                timelineTargetGroupActiveGroupUseCase(event);
            }, 500);

        } else {

            // フレーム選択
            await timelineLayerFrameSelectedStartUseCase(
                workSpace,
                movieClip,
                layer,
                frame,
                [frame],
                event
            );

        }

    } else {
        // ダブルタップを終了
        wait = false;

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // todo
        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {

            const activeCharacter = activeCharacters[0];
            const length = activeCharacter.endFrame - activeCharacter.startFrame;
            const frames = Array.from({ "length": length }, (_, idx) => idx + activeCharacter.startFrame);

            await timelineLayerFrameSelectedStartUseCase(
                workSpace,
                movieClip,
                layer,
                frame,
                frames,
                event
            );

            movieClip.selectedFrameObject.start = activeCharacter.startFrame;
            movieClip.selectedFrameObject.end   = activeCharacter.endFrame - 1;

        } else {

            const emptyCharacter = layer.getActiveEmptyCharacter(frame);
            if (emptyCharacter) {

                const length = emptyCharacter.endFrame - emptyCharacter.startFrame;
                const frames = Array.from({ "length": length }, (_, idx) => idx + emptyCharacter.startFrame);

                await timelineLayerFrameSelectedStartUseCase(
                    workSpace,
                    movieClip,
                    layer,
                    frame,
                    frames,
                    event
                );

                movieClip.selectedFrameObject.start = emptyCharacter.startFrame;
                movieClip.selectedFrameObject.end   = emptyCharacter.endFrame - 1;

            }
        }
    }
};