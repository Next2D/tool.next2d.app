import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateLightIconStyleService } from "../service/TimelineLayerControllerUpdateLightIconStyleService";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    const layerId: number = parseInt(element.dataset.layerId as string);

    // 指定のLayerオブジェクトを取得
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layerId);

    if (!layer) {
        return ;
    }

    // 反転して登録
    timelineLayerControllerUpdateLightIconStyleService(layerId, !layer.light);
};