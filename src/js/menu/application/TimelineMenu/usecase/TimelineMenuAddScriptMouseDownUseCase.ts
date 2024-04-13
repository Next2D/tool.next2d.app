import { $allHideMenu } from "../../MenuUtil";
import { execute as scriptEditorModalCurrentBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalCurrentBootUseCase";

/**
 * @description タイムラインメニューのスクリプト追加ボタンのマウスダウンイベント
 *              Mouse down event of the script add button in the timeline menu
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

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示にする
    $allHideMenu();

    // スクリプトを追加
    scriptEditorModalCurrentBootUseCase();
};