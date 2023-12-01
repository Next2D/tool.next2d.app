import { execute as timelineLayerControllerMenuShowService } from "@/menu/application/TimelineLayerControllerMenu/service/TimelineLayerControllerMenuShowService";
import { execute as timelineLayerLockIconMouseDownEventUseCase } from "./TimelineLayerLockIconMouseDownEventUseCase";
import { execute as timelineLayerDisableIconMouseDownEventUseCase } from "./TimelineLayerDisableIconMouseDownEventUseCase";
import { execute as timelineLayerLightIconMouseDownEventUseCase } from "./TimelineLayerLightIconMouseDownEventUseCase";
import { execute as timelineLayerNameTextMouseDownEventUseCase } from "./TimelineLayerNameTextMouseDownEventUseCase";
import { execute as timelineLayerNameTextInactiveStyleService } from "../service/TimelineLayerNameTextInactiveStyleService";
import { execute as timelineLayerNameTextKeyPressEventService } from "../service/TimelineLayerNameTextKeyPressEventService";
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
    // マウスダウンイベントを登録

    // 右クリックイベント登録
    element.addEventListener("contextmenu", timelineLayerControllerMenuShowService);

    const layerId: string = element.dataset.layerId as string;

    // レイヤー名のElementにイベントを登録
    const textElement: HTMLElement | null = document
        .getElementById(`layer-name-${layerId}`);

    if (textElement) {
        textElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerNameTextMouseDownEventUseCase
        );

        textElement.addEventListener("focusout",
            timelineLayerNameTextInactiveStyleService
        );
        textElement.addEventListener("keypress",
            timelineLayerNameTextKeyPressEventService
        );
    }

    // ハイライトアイコンにイベントを登録
    const lightElement: HTMLElement | null = document
        .getElementById(`layer-light-icon-${layerId}`);

    if (lightElement) {
        lightElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerLightIconMouseDownEventUseCase
        );
    }

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