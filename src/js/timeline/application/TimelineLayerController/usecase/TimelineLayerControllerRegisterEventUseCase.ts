import { execute as timelineLayerControllerMenuShowService } from "@/menu/application/TimelineLayerControllerMenu/service/TimelineLayerControllerMenuShowService";
import { execute as timelineLayerControllerLockIconMouseDownEventUseCase } from "./TimelineLayerControllerLockIconMouseDownEventUseCase";
import { execute as timelineLayerControllerDisableIconMouseDownEventUseCase } from "./TimelineLayerControllerDisableIconMouseDownEventUseCase";
import { execute as timelineLayerControllerLightIconMouseDownEventUseCase } from "./TimelineLayerControllerLightIconMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextMouseDownEventUseCase } from "./TimelineLayerControllerNameTextMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextInactiveStyleService } from "../service/TimelineLayerControllerNameTextInactiveStyleService";
import { execute as timelineLayerControllerNameTextKeyPressEventService } from "../service/TimelineLayerControllerNameTextKeyPressEventService";
import { execute as timelineLayerControllerLayerIconMouseDownEventUseCase } from "./TimelineLayerControllerLayerIconMouseDownEventUseCase";
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
    element.addEventListener("contextmenu",
        timelineLayerControllerMenuShowService
    );

    const layerId: string = element.dataset.layerId as string;

    // 通常レイヤーのアイコンにイベントを登録
    const layerIconElement: HTMLElement | null = document
        .getElementById(`layer-icon-${layerId}`);

    if (layerIconElement) {

        // マウスダウンイベント
        layerIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLayerIconMouseDownEventUseCase
        );
    }

    // TODO アイコンにイベント登録

    // レイヤー名のElementにイベントを登録
    const textElement: HTMLElement | null = document
        .getElementById(`layer-name-${layerId}`);

    if (textElement) {

        // マウスダウンイベント
        textElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerNameTextMouseDownEventUseCase
        );

        // フォーカスアウトイベント
        textElement.addEventListener("focusout",
            timelineLayerControllerNameTextInactiveStyleService
        );

        // キープレスイベント
        textElement.addEventListener("keypress",
            timelineLayerControllerNameTextKeyPressEventService
        );
    }

    // ハイライトアイコンにイベントを登録
    const lightElement: HTMLElement | null = document
        .getElementById(`layer-light-icon-${layerId}`);

    if (lightElement) {
        lightElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLightIconMouseDownEventUseCase
        );
    }

    // 表示アイコンにイベントを登録
    const disableIconElement: HTMLElement | null = document
        .getElementById(`layer-disable-icon-${layerId}`);

    if (disableIconElement) {
        disableIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerDisableIconMouseDownEventUseCase
        );
    }

    // ロックアイコンにイベントを登録
    const lockIconElement: HTMLElement | null = document
        .getElementById(`layer-lock-icon-${layerId}`);

    if (lockIconElement) {
        lockIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLockIconMouseDownEventUseCase
        );
    }
};