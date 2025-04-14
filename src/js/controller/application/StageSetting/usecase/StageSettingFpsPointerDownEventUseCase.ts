import { execute as stageSettingFpsRegisterPointerEventUseCase } from "./StageSettingFpsRegisterPointerEventUseCase";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $setBeforeFps } from "../StagsSettingUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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

    // イベントの伝播を止める
    // fixed logic
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // スクロール処理を行うので、イベントの伝播を止める
    // fixed logic
    event.preventDefault();

    // 変更前の幅をセット
    $setBeforeFps(parseInt(element.value));

    // 移動のイベントを登録
    stageSettingFpsRegisterPointerEventUseCase(event);
};