import { execute as scriptEditorModalCurrentBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalCurrentBootUseCase";

/**
 * @description ヘッダーメニューのスクリプト追加ボタンの実行関数
 *              Execution function of the Add Script button in the header menu
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // スクリプトエディターを表示
    scriptEditorModalCurrentBootUseCase();
};