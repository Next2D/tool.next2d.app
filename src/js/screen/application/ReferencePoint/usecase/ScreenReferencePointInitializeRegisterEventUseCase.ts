import { $REFERENCE_POINT_ID } from "@/config/ReferenceSettingConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenReferencePointPointerDownEventUseCase } from "./ScreenReferencePointPointerDownEventUseCase";

/**
 * @description スクリーンに配置されている中心点のイベント登録ユースケース
 *              Register event for the reference point placed on the screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($REFERENCE_POINT_ID);

    if (!element) {
        return ;
    }

    // ポインターが押されたときのイベントを登録
    element.addEventListener(EventType.POINTER_DOWN,
        screenReferencePointPointerDownEventUseCase
    );
};