import type { Layer } from "@/core/domain/model/Layer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getTopIndex } from "../../TimelineUtil";
import { execute as timelineLayerControllerUpdateLightIconStyleService } from "../service/TimelineLayerControllerUpdateLightIconElementService";
import { execute as timelineLayerUpdateLightService } from "@/timeline/application/TimelineLayer/service/TimelineLayerUpdateLightService";

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

    // イベントターゲットのLayerIDを取得
    const index = $getTopIndex() + parseInt(element.dataset.layerIndex as string);

    // 指定のLayerオブジェクトを取得
    const layer: Layer | undefined = $getCurrentWorkSpace()
        .scene
        .layers[index];

    if (!layer) {
        return ;
    }

    // 現在の設定を反転して変数にセット
    const light = !layer.light;

    // 表示Elementを更新
    timelineLayerControllerUpdateLightIconStyleService(layer.id, light);

    // Layerオブジェクトの値を更新
    timelineLayerUpdateLightService(layer.id, light);
};