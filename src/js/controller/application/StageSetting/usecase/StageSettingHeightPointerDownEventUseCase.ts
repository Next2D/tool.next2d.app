import { execute as stageSettingHeightRegisterPointerEventUseCase } from "./StageSettingHeightRegisterPointerEventUseCase";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import {
    $setBeforeHeight,
    $setBeforeWidth
} from "../StagsSettingUtil";

/**
 * @description ステージエリアの高さのマウスダウンイベントユースケース
 *              Mouse down event use case for stage area height
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

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // スクロール処理を行うので、イベントの伝播を止める
    // fixed logic
    event.preventDefault();

    // 変更前の幅をセット
    $setBeforeHeight(parseInt(element.value));

    // ロック時は高さもセット
    if (stageSetting.lock) {
        const element: HTMLInputElement | null = document
            .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        // 変更前の高さをセット
        $setBeforeWidth(parseInt(element.value));
    }

    // ポインターイベントを登録
    stageSettingHeightRegisterPointerEventUseCase(event);
};