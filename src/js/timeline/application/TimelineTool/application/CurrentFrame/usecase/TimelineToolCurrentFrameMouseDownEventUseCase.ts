import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineToolCurrentFramePointerRegisterEventUseCase } from "./TimelineToolCurrentFramePointerRegisterEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description タイムラインの現在フレームのInput Elementのマウスダウン処理関数
 *              Mouse-down processing function for the Input Element at the current frame of the timeline
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0
        || $useKeyboard()
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // レイヤー・フレームElementのアクティブ状態をリセット
    const workSpace = $getCurrentWorkSpace();
    const externalTimeline = new ExternalTimeline(workSpace, workSpace.scene);
    await externalTimeline.deactivatedAllLayers();

    // 移動イベントを登録
    timelineToolCurrentFramePointerRegisterEventUseCase(event);
};