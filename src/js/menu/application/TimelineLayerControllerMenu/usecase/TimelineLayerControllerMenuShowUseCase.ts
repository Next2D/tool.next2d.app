import type { MenuImpl } from "@/interface/MenuImpl";
import type { TimelineLayerControllerMenu } from "@/menu/domain/model/TimelineLayerControllerMenu";
import { $getLayerFromElement } from "@/timeline/application/TimelineUtil";
import { $TIMELINE_LAYER_MENU_NAME } from "@/config/MenuConfig";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerNormalSelectUseCase";
import { execute as timelineLayerControllerMenuSetColorService } from "../service/TimelineLayerControllerMenuSetColorService";
import { execute as timelineLayerControllerMenuUpdateIconStyleService } from "../service/TimelineLayerControllerMenuUpdateIconStyleService";
import { execute as externalMovieClipSelectedLayerService } from "@/external/core/application/ExternalMovieClip/service/ExternalMovieClipSelectedLayerService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

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

    const scene = $getCurrentWorkSpace().scene;

    // 指定のレイヤーだけを選択状態に更新
    timelineLayerControllerNormalSelectUseCase(
        layer, scene.currentFrame
    );

    // 内部データとしてレイヤーを選択状態に更新
    // fixed logic
    externalMovieClipSelectedLayerService(
        scene, layer, scene.currentFrame
    );

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