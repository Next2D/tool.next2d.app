import { execute as timelineLayerControllerMenuShowUseCase } from "@/menu/application/TimelineLayerControllerMenu/usecase/TimelineLayerControllerMenuShowUseCase";
import { execute as timelineLayerControllerLightIconMouseDownEventUseCase } from "./TimelineLayerControllerLightIconMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextMouseDownEventUseCase } from "./TimelineLayerControllerNameTextMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextKeyPressEventService } from "../service/TimelineLayerControllerNameTextKeyPressEventService";
import { execute as timelineLayerControllerLayerIconMouseDownEventUseCase } from "./TimelineLayerControllerLayerIconMouseDownEventUseCase";
import { execute as timelineLayerControllerMouseDownEventUseCase } from "./TimelineLayerControllerMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextFocusoutEventUseCase } from "./TimelineLayerControllerNameTextFocusoutEventUseCase";
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
        timelineLayerControllerMenuShowUseCase
    );

    // マウスダウンイベント
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineLayerControllerMouseDownEventUseCase
    );

    // 通常レイヤーのアイコンにイベントを登録
    const layerIconElements = element
        .getElementsByClassName("timeline-layer-icon");

    if (layerIconElements) {

        const element = layerIconElements[0] as NonNullable<HTMLElement>;

        // マウスダウンイベント
        element.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLayerIconMouseDownEventUseCase
        );
    }

    // TODO アイコンにイベント登録

    // レイヤー名のElementにイベントを登録
    const textElements = element
        .getElementsByClassName("view-text");

    if (textElements) {

        const element = textElements[0] as NonNullable<HTMLElement>;

        // マウスダウンイベント
        element.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerNameTextMouseDownEventUseCase
        );

        // フォーカスアウトイベント
        element.addEventListener("focusout",
            timelineLayerControllerNameTextFocusoutEventUseCase
        );

        // キープレスイベント
        element.addEventListener("keypress",
            timelineLayerControllerNameTextKeyPressEventService
        );
    }

    // ハイライトアイコンにイベントを登録
    const lightElements = element
        .getElementsByClassName("timeline-layer-light-one");

    if (lightElements) {
        const element = lightElements[0] as NonNullable<HTMLElement>;

        element.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLightIconMouseDownEventUseCase
        );
    }

    // // 表示アイコンにイベントを登録
    // const disableIconElement: HTMLElement | null = document
    //     .getElementById(`layer-disable-icon-${layerId}`);

    // if (disableIconElement) {
    //     // マウスダウンのイベントを登録
    //     disableIconElement.addEventListener(EventType.MOUSE_DOWN,
    //         timelineLayerControllerDisableIconMouseDownEventUseCase
    //     );

    //     // マウスオーバーのイベントを登録
    //     disableIconElement.addEventListener(EventType.MOUSE_OVER,
    //         timelineLayerControllerDisableIconMouseOverUseCase
    //     );
    // }

    // // ロックアイコンにイベントを登録
    // const lockIconElement: HTMLElement | null = document
    //     .getElementById(`layer-lock-icon-${layerId}`);

    // if (lockIconElement) {
    //     // マウスダウンのイベントを登録
    //     lockIconElement.addEventListener(EventType.MOUSE_DOWN,
    //         timelineLayerControllerLockIconMouseDownEventUseCase
    //     );

    //     // マウスオーバーのイベントを登録
    //     lockIconElement.addEventListener(EventType.MOUSE_OVER,
    //         timelineLayerControllerLockIconMouseOverUseCase
    //     );
    // }
};