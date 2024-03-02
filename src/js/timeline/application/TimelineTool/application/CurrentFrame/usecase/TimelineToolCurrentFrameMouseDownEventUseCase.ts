import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineToolCurrentFrameWindowRegisterEventUseCase } from "./TimelineToolCurrentFrameWindowRegisterEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description タイムラインの現在フレームのInput Elementのマウスダウン処理関数
 *              Mouse-down processing function for the Input Element at the current frame of the timeline
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0 || $useKeyboard()) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示にする
    $allHideMenu();

    // レイヤー・フレームElementのアクティブ状態をリセット
    const workSpace = $getCurrentWorkSpace();
    const externalTimeline = new ExternalTimeline(workSpace, workSpace.scene);
    externalTimeline.deactivatedAllLayers();

    // windowイベントを登録
    timelineToolCurrentFrameWindowRegisterEventUseCase();
};