import { execute as stageAreaWidthRegisterWindowEventUseCase } from "./StageAreaWidthRegisterWindowEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

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

    // windowのイベントを登録
    stageAreaWidthRegisterWindowEventUseCase();
};