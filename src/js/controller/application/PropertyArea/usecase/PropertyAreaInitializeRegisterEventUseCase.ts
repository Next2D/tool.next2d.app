import { EventType } from "@/tool/domain/event/EventType";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { execute as propertyAreaTitleMouseDownEventService } from "../service/PropertyAreaTitleMouseDownEventService";
import { execute as propertyAreaMouseOutEventService } from "../service/PropertyAreaMouseOutEventService";
import { execute as propertyAreaMouseUpEventUseCase } from "./PropertyAreaMouseUpEventUseCase";
import { execute as propertyAreaMouseDownEventUseCase } from "./PropertyAreaMouseDownEventUseCase";
import { execute as propertyAreaSoundAreaInitializeRegisterEventUseCase } from "@/controller/application/SoundArea/usecase/PropertyAreaSoundAreaInitializeRegisterEventUseCase";

/**
 * @description プロパティーエリアの移動イベントを登録
 *              Register property area move events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // サウンドエリアのイベント登録
    propertyAreaSoundAreaInitializeRegisterEventUseCase();

    // プロパティーエリアのイベント登録
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (!element) {
        return ;
    }

    // プロパティーのタイトルにマウスダウンイベントを登録
    const elements = element
        .querySelectorAll(".container-title");

    const length: number = elements.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const element: HTMLElement | undefined = elements[idx] as HTMLElement;
        if (!element) {
            continue;
        }

        element
            .addEventListener(
                EventType.MOUSE_DOWN,
                propertyAreaTitleMouseDownEventService
            );
    }

    // タップ、ダブルタップの処理
    element.addEventListener(EventType.MOUSE_DOWN, propertyAreaMouseDownEventUseCase);
    element.addEventListener(EventType.MOUSE_UP, propertyAreaMouseUpEventUseCase);
    element.addEventListener(EventType.MOUSE_OUT, propertyAreaMouseOutEventService);
};