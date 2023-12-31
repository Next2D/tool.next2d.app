import type { Layer } from "@/core/domain/model/Layer";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { TimelineLayerControllerMenu } from "@/menu/domain/model/TimelineLayerControllerMenu";
import { $getTopIndex } from "@/timeline/application/TimelineUtil";
import { $TIMELINE_LAYER_MENU_NAME } from "@/config/MenuConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $TIMELINE_CONTROLLER_LAYER_COLOR_ID } from "@/config/TimelineLayerControllerMenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";

/**
 * @description レイヤーのコントローラーメニューを表示
 *              Display the Layer Controller menu
 *
 * @param  {MouseEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MouseEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示
    $allHideMenu($TIMELINE_LAYER_MENU_NAME);

    const menu: MenuImpl<TimelineLayerControllerMenu> | null = $getMenu($TIMELINE_LAYER_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_MENU_NAME);

    if (!element) {
        return ;
    }

    const iconElement: HTMLElement | null = event.target as HTMLElement;
    if (!iconElement) {
        return ;
    }

    // 選択されたLayerオブジェクトを取得
    const index = $getTopIndex() + parseInt(iconElement.dataset.layerIndex as string);

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    const layer: Layer | undefined = scene.layers[index];
    if (!layer) {
        return ;
    }

    // カラー設定Element
    const colorElement: HTMLInputElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_COLOR_ID) as HTMLInputElement;

    if (!colorElement) {
        return ;
    }

    // カラー表示を更新
    colorElement.value = layer.color;

    // 指定のレイヤーだけを選択状態に更新
    timelineLayerControllerNormalSelectUseCase(layer.id);

    // 指定レイヤーElementをアクティブ表示に更新
    const layerElement: HTMLElement | undefined = timelineLayer.elements[index];
    if (layerElement) {
        timelineLayerActiveElementService(layerElement);
    }

    let top = event.pageY - element.clientHeight;
    if (0 > top) {
        top = 15;
    }

    menu.offsetLeft = event.pageX + 15;
    menu.offsetTop  = top;
    menu.show();
};