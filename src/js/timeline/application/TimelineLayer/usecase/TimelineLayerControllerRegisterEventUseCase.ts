import { execute as timelineLayerControllerMenuShowService } from "@/menu/application/TimelineLayerControllerMenu/service/TimelineLayerControllerMenuShowService";
import { execute as timelineLayerLockIconMouseDownEventUseCase } from "./TimelineLayerLockIconMouseDownEventUseCase";
import { execute as timelineLayerDisableIconMouseDownEventUseCase } from "./TimelineLayerDisableIconMouseDownEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";

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

    const layerId: string = element.dataset.layerId as string;

    // 表示アイコンにイベントを登録
    const disableIconElement: HTMLElement | null = document
        .getElementById(`layer-disable-icon-${layerId}`);

    if (disableIconElement) {
        disableIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerDisableIconMouseDownEventUseCase
        );
    }

    // ロックアイコンにイベントを登録
    const lockIconElement: HTMLElement | null = document
        .getElementById(`layer-lock-icon-${layerId}`);

    if (lockIconElement) {
        lockIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerLockIconMouseDownEventUseCase
        );
    }
};