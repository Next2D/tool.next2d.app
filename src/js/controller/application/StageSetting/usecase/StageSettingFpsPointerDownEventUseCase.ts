import { execute as stageSettingFpsRegisterPointerEventUseCase } from "./StageSettingFpsRegisterPointerEventUseCase";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $setBeforeFps } from "../StagsSettingUtil";

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
    ) {
        return ;
    }

    // 再生中なら一時停止
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    // イベントの伝播を止める
    // fixed logic
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    // スクロール処理を行うので、イベントの伝播を止める
    // fixed logic
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