import { execute as timelineLayerControllerMenuShowUseCase } from "@/menu/application/TimelineLayerControllerMenu/usecase/TimelineLayerControllerMenuShowUseCase";
import { execute as timelineLayerControllerLightIconPointerDownEventService } from "../service/TimelineLayerControllerLightIconPointerDownEventService";
import { execute as timelineLayerControllerNameTextMouseDownEventUseCase } from "./TimelineLayerControllerNameTextMouseDownEventUseCase";
import { execute as timelineLayerControllerNameTextKeyPressEventService } from "../service/TimelineLayerControllerNameTextKeyPressEventService";
import { execute as timelineLayerControllerLayerIconPointerDownEventUseCase } from "./TimelineLayerControllerLayerIconPointerDownEventUseCase";
import { execute as timelineLayerControllerPointerDownEventUseCase } from "./TimelineLayerControllerPointerDownEventUseCase";
import { execute as timelineLayerControllerNameTextFocusOutEventUseCase } from "./TimelineLayerControllerNameTextFocusOutEventUseCase";
import { execute as timelineLayerControllerDisableIconPointerDownEventUseCase } from "./TimelineLayerControllerDisableIconPointerDownEventUseCase";
import { execute as timelineLayerControllerDisableIconPointerOverService } from "../service/TimelineLayerControllerDisableIconPointerOverService";
import { execute as timelineLayerControllerLockIconPointerDownEventUseCase } from "./TimelineLayerControllerLockIconPointerDownEventUseCase";
import { execute as timelineLayerControllerLockIconPointerOverService } from "../service/TimelineLayerControllerLockIconPointerOverService";
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
    element.addEventListener(EventType.POINTER_DOWN,
        timelineLayerControllerPointerDownEventUseCase
    );

    // 通常レイヤーのアイコンにイベントを登録
    const iconElement = element
        .querySelector(".timeline-layer-icon") as HTMLElement;

    if (iconElement) {
        // マウスダウンイベント
        iconElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerLayerIconPointerDownEventUseCase
        );
    }

    // レイヤー名のElementにイベントを登録
    const textElement = element
        .querySelector(".identification-view-text") as HTMLElement;

    if (textElement) {

        // マウスダウンイベント
        textElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerNameTextMouseDownEventUseCase
        );

        // フォーカスアウトイベント
        textElement.addEventListener("focusout",
            timelineLayerControllerNameTextFocusOutEventUseCase
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
        lightElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerLightIconPointerDownEventService
        );
    }

    // 表示アイコンにイベントを登録
    const disableIconElement = element
        .querySelector(".timeline-layer-disable-one") as HTMLElement;

    if (disableIconElement) {

        // マウスダウンのイベントを登録
        disableIconElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerDisableIconPointerDownEventUseCase,
            { "passive": false }
        );

        // マウスオーバーのイベントを登録
        disableIconElement.addEventListener(EventType.POINTER_OVER,
            timelineLayerControllerDisableIconPointerOverService
        );
    }

    // ロックアイコンにイベントを登録
    const lockIconElement = element
        .querySelector(".timeline-layer-lock-one") as HTMLElement;

    if (lockIconElement) {
        // マウスダウンのイベントを登録
        lockIconElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerLockIconPointerDownEventUseCase
        );

        // マウスオーバーのイベントを登録
        lockIconElement.addEventListener(EventType.POINTER_OVER,
            timelineLayerControllerLockIconPointerOverService
        );
    }
};