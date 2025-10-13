import { $BLEND_SELECT_ID } from "@/config/BlendModeConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as blendModeSettingSelectEventService } from "../service/BlendModeSettingSelectEventService";

/**
 * @description ブレンドモード設定エリアの初回イベント登録ユースケース
 *              Initial event registration use case for the blend mode setting area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLSelectElement | null = document
        .getElementById($BLEND_SELECT_ID) as HTMLSelectElement;

    if (!element) {
        return;
    }

    element.addEventListener(EventType.CHANGE,
        blendModeSettingSelectEventService
    );
};