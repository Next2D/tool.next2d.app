import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerDisableIconWindowMouseUpService } from "../service/TimelineLayerControllerDisableIconWindowMouseUpService";
import {
    $getDisableState,
    $getLayerFromElement,
    $setDisableState
} from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description レイヤーの表示・非表示アイコンのイベント処理
 *              Event processing for layer show/hide icons
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
    if (!$getDisableState()) {
        $setDisableState(true);
        window.addEventListener(EventType.POINTER_UP,
            timelineLayerControllerDisableIconWindowMouseUpService
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
    await externalLayer.setDisable(!layer.disable);
};