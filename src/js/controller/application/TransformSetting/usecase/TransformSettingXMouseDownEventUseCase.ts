import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as transformSettingXRegisterWindowEventUseCase } from "./TransformSettingXRegisterWindowEventUseCase";
import { $getMovePositon } from "@/tool/application/ToolUtil";

/**
 * @description 変形エリアのx座標のマウスダウンイベント
 *              Mouse down event for x-coordinate of deformation area
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

    // マウスで移動した量を更新
    const movePosition = $getMovePositon();
    movePosition.x = 0;
    movePosition.y = 0;

    // windowのイベントを登録
    transformSettingXRegisterWindowEventUseCase();
};