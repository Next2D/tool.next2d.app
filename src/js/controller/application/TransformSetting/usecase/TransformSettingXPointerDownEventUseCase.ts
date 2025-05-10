import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as transformSettingXRegisterPointerEventUseCase } from "./TransformSettingXRegisterPointerEventUseCase";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親のイベントを止める
    event.stopPropagation();
    if ($useKeyboard()) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // fixed logic
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // マウスで移動した量を更新
    transformSetting.x = 0;
    transformSetting.y = 0;
    transformSetting.tempPosition.x = parseFloat(element.value);

    // windowのイベントを登録
    transformSettingXRegisterPointerEventUseCase(event);
};