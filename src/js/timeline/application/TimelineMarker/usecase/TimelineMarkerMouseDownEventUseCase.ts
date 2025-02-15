import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMarkerPointerMoveEventUseCase } from "./TimelineMarkerPointerMoveEventUseCase";
import { execute as timelineMarkerPointerUpEventUseCase } from "./TimelineMarkerPointerUpEventUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $setCursor } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description マーカー移動用の関数をwindowに登録
 *              Register functions for marker movement in window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // カーソルを変更
    $setCursor("ew-resize");

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 選択中のレイヤーを全て非アクティブ化
    const workSpace = $getCurrentWorkSpace();
    const externalTimeline = new ExternalTimeline(workSpace, workSpace.scene);
    externalTimeline.deactivatedAllLayers();

    // windowにイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineMarkerPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineMarkerPointerUpEventUseCase,
        { "passive": false }
    );
};