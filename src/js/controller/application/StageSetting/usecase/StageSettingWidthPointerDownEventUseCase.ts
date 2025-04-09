import { execute as stageSettingWidthRegisterPointerEventUseCase } from "./StageSettingWidthRegisterPointerEventUseCase";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $STAGE_HEIGHT_ID } from "@/config/StageSettingConfig";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import {
    $setBeforeHeight,
    $setBeforeWidth
} from "../StagsSettingUtil";

/**
 * @description ステージエリアの幅のマウスダウンイベントユースケース
 *              Mouse down event use case for the width of the stage area
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

    // 入力中はスキップ
    if ($useKeyboard()) {
        return ;
    }

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // スクロール処理を行うので、イベントの伝播を止める
    // fixed logic
    event.preventDefault();

    // 変更前の幅をセット
    $setBeforeWidth(parseInt(element.value));

    // ロック時は高さもセット
    if (stageSetting.lock) {
        const element: HTMLInputElement | null = document
            .getElementById($STAGE_HEIGHT_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        // 変更前の高さをセット
        $setBeforeHeight(parseInt(element.value));
    }

    // 移動のイベントを登録
    stageSettingWidthRegisterPointerEventUseCase(event);
};