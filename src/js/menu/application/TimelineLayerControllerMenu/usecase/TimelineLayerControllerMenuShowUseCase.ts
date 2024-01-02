import type { MenuImpl } from "@/interface/MenuImpl";
import type { TimelineLayerControllerMenu } from "@/menu/domain/model/TimelineLayerControllerMenu";
import { $getLayerFromElement } from "@/timeline/application/TimelineUtil";
import { $TIMELINE_LAYER_MENU_NAME } from "@/config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineLayerControllerMenuSetColorService } from "../service/TimelineLayerControllerMenuSetColorService";
import { execute as timelineLayerControllerMenuUpdateIconStyleService } from "../service/TimelineLayerControllerMenuUpdateIconStyleService";

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

    const targetElement: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!targetElement) {
        return ;
    }

    const layer = $getLayerFromElement(targetElement);
    if (!layer) {
        return ;
    }

    const layerElement: HTMLElement | undefined = timelineLayer
        .getLayerElementFromElement(targetElement);

    if (!layerElement) {
        return ;
    }

    // 指定のレイヤーだけを選択状態に更新
    timelineLayerControllerNormalSelectUseCase(layer.id);

    // 指定レイヤーElementをアクティブ表示に更新
    timelineLayerActiveElementService(layerElement);

    // レイヤーのモードに合わせてモード設定をアクティブ表示
    timelineLayerControllerMenuUpdateIconStyleService(layer);

    // カラー表示を更新
    timelineLayerControllerMenuSetColorService(targetElement);

    // メニューの表示位置を調整
    let top = event.pageY - element.clientHeight;
    if (0 > top) {
        top = 15;
    }

    menu.offsetLeft = event.pageX + 15;
    menu.offsetTop  = top;
    menu.show();
};