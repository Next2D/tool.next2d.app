import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as scaleFrameRegisterWindowEventUseCase } from "./ScaleFrameRegisterPointerEventUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description フレームのスケール設定のマウスダウンイベントユースケース
 *              Frame scale setting mouse down event use case
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

    // カーソルイベントを動かす為、イベントの伝達を止める
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // windowのイベントを登録
    scaleFrameRegisterWindowEventUseCase(event);
};