import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as transformSettingYRegisterWindowEventUseCase } from "./TransformSettingYRegisterWindowEventUseCase";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

/**
 * @description 変形エリアのy座標のマウスダウンイベント
 *              Mouse down event for y-coordinate of deformation area
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
    transformSetting.movePosition.x = 0;
    transformSetting.movePosition.y = 0;

    // windowのイベントを登録
    transformSettingYRegisterWindowEventUseCase();
};