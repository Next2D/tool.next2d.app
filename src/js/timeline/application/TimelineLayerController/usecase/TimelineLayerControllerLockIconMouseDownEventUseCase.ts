import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconElementService";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getLayerFromElement, $getLockState, $setLockState } from "../../TimelineUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerLockIconWindowMouseUpService } from "../service/TimelineLayerControllerLockIconWindowMouseUpService";

/**
 * @description レイヤーのロックアイコンのイベント処理
 *              Layer lock icon event handling
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

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

    // 連続表示機能を有効にする
    if (!$getLockState()) {
        $setLockState(true);
        window.addEventListener(EventType.MOUSE_UP,
            timelineLayerControllerLockIconWindowMouseUpService
        );
    }

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    // Layerオブジェクトの値を更新
    layer.lock = !layer.lock;

    // 反転して登録
    timelineLayerControllerUpdateLockIconStyleService(layer.id, layer.lock);
};