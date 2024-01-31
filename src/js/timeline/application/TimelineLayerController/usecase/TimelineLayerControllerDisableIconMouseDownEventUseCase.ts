import { execute as timelineLayerControllerUpdateDisableIconElementService } from "../service/TimelineLayerControllerUpdateDisableIconElementService";
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

/**
 * @description レイヤーの表示・非表示アイコンのイベント処理
 *              Event processing for layer show/hide icons
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
    if (!$getDisableState()) {
        $setDisableState(true);
        window.addEventListener(EventType.MOUSE_UP,
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
    externalLayer.setDisable(!layer.disable);

    // 表示Elementを更新
    timelineLayerControllerUpdateDisableIconElementService(layer, layer.disable);
};