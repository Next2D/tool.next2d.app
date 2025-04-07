import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getLayerFromElement, $getLockState, $setLockState } from "../../TimelineUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerLockIconWindowPointerUpService } from "../service/TimelineLayerControllerLockIconWindowPointerUpService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description レイヤーのロックアイコンのイベント処理
 *              Layer lock icon event handling
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

    // 親のイベントを中止
    event.stopPropagation();

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 連続表示機能を有効にする
    if (!$getLockState()) {
        $setLockState(true);
        window.addEventListener(EventType.POINTER_UP,
            timelineLayerControllerLockIconWindowPointerUpService
        );
        window.addEventListener(EventType.POINTER_CANCEL,
            timelineLayerControllerLockIconWindowPointerUpService
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

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLayer = new ExternalLayer(workSpace, workSpace.scene, layer);

    // Layerオブジェクトの値を更新
    await externalLayer.setLock(!layer.lock);
};