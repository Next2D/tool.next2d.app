import { execute as timelineLayerControllerMenuShowUseCase } from "@/menu/application/TimelineLayerControllerMenu/usecase/TimelineLayerControllerMenuShowUseCase";
import { execute as timelineLayerControllerLightIconMouseDownEventService } from "../service/TimelineLayerControllerLightIconMouseDownEventService";
import { execute as timelineLayerControllerNameTextMouseDownEventUseCase } from "./TimelineLayerControllerNameTextMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextKeyPressEventService } from "../service/TimelineLayerControllerNameTextKeyPressEventService";
import { execute as timelineLayerControllerLayerIconMouseDownEventUseCase } from "./TimelineLayerControllerLayerIconMouseDownEventUseCase";
import { execute as timelineLayerControllerMouseDownEventUseCase } from "./TimelineLayerControllerMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextFocusoutEventUseCase } from "./TimelineLayerControllerNameTextFocusoutEventUseCase";
import { execute as timelineLayerControllerDisableIconMouseDownEventUseCase } from "./TimelineLayerControllerDisableIconMouseDownEventUseCase";
import { execute as timelineLayerControllerDisableIconMouseOverService } from "../service/TimelineLayerControllerDisableIconMouseOverService";
import { execute as timelineLayerControllerLockIconMouseDownEventUseCase } from "./TimelineLayerControllerLockIconMouseDownEventUseCase";
import { execute as timelineLayerControllerLockIconMouseOverService } from "../service/TimelineLayerControllerLockIconMouseOverService";
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
    const iconElement = element
        .querySelector(".timeline-layer-icon") as HTMLElement;

    if (iconElement) {
        // マウスダウンイベント
        iconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLayerIconMouseDownEventUseCase
        );
    }

    // レイヤー名のElementにイベントを登録
    const textElement = element
        .querySelector(".identification-view-text") as HTMLElement;

    if (textElement) {

        // マウスダウンイベント
        textElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerNameTextMouseDownEventUseCase
        );

        // フォーカスアウトイベント
        textElement.addEventListener("focusout",
            timelineLayerControllerNameTextFocusoutEventUseCase
        );

        // キープレスイベント
        textElement.addEventListener("keypress",
            timelineLayerControllerNameTextKeyPressEventService
        );
    }

    // ハイライトアイコンにイベントを登録
    const lightElement = element
        .querySelector(".timeline-layer-light-one") as HTMLElement;

    if (lightElement) {
        lightElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLightIconMouseDownEventService
        );
    }

    // 表示アイコンにイベントを登録
    const disableIconElement = element
        .querySelector(".timeline-layer-disable-one") as HTMLElement;

    if (disableIconElement) {

        // マウスダウンのイベントを登録
        disableIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerDisableIconMouseDownEventUseCase
        );

        // マウスオーバーのイベントを登録
        disableIconElement.addEventListener(EventType.MOUSE_OVER,
            timelineLayerControllerDisableIconMouseOverService
        );
    }

    // ロックアイコンにイベントを登録
    const lockIconElement = element
        .querySelector(".timeline-layer-lock-one") as HTMLElement;

    if (lockIconElement) {
        // マウスダウンのイベントを登録
        lockIconElement.addEventListener(EventType.MOUSE_DOWN,
            timelineLayerControllerLockIconMouseDownEventUseCase
        );

        // マウスオーバーのイベントを登録
        lockIconElement.addEventListener(EventType.MOUSE_OVER,
            timelineLayerControllerLockIconMouseOverService
        );
    }
};