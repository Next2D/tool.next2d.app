import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "../service/TimelineLayerControllerUpdateLightIconElementService";

/**
 * @description レイヤーのハイライトアイコンのイベント処理
 *              Layer highlight icon event handling
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
    layer.light = !layer.light;

    // 表示Elementを更新
    timelineLayerControllerUpdateLightIconElementService(layer, layer.light);
};