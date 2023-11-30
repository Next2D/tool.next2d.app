import { execute as timelineLayerControllerMenuShowService } from "@/menu/application/TimelineLayerControllerMenu/service/TimelineLayerControllerMenuShowService";

/**
 * @description レイヤーのコントローラー部分のイベント登録処理
 *              Event registration process for the controller part of the layer
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 右クリックイベント登録
    element.addEventListener("contextmenu", timelineLayerControllerMenuShowService);

    console.log([element]);
};