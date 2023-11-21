import { $STAGE_SETTING_TITLE_ID } from "@/config/StageSettingConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingTitleMouseDownEventService } from "../service/StageSettingTitleMouseDownEventService";

/**
 * @description ステージ設定のイベント登録
 *              Event Registration for Stage Setup
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($STAGE_SETTING_TITLE_ID);

    if (!element) {
        return ;
    }

    // タップイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN, stageSettingTitleMouseDownEventService);
};