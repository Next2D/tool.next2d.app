import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $setBeforeFps } from "../StagsSettingUtil";
import { execute as stageSettingFpsRegisterPointerEventUseCase } from "./StageSettingFpsRegisterPointerEventUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description ステージのフレームレート設定のマウスダウンイベントユースケース
 *              Mouse down event use case for stage frame rate setting
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag
    ) {
        return ;
    }

    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 変更前の幅をセット
    $setBeforeFps(parseInt(element.value));

    // 移動のイベントを登録
    stageSettingFpsRegisterPointerEventUseCase(event);
};