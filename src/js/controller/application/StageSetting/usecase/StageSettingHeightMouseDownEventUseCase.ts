import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";
import { execute as stageSettingHeightRegisterWindowEventUseCase } from "./StageSettingHeightRegisterWindowEventUseCase";
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
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを止める
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

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

    // windowのイベントを登録
    stageSettingHeightRegisterWindowEventUseCase();
};