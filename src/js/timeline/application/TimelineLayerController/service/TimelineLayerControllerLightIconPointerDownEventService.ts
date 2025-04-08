import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
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

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLayer = new ExternalLayer(workSpace, workSpace.scene, layer);

    // Layerオブジェクトの値を更新
    externalLayer.setLight(!layer.light);
};