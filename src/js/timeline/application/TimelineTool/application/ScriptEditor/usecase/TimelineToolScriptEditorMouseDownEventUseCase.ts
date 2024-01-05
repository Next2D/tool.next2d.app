import { execute as scriptEditorModalBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalBootUseCase";

/**
 * @description スクリプトエディタ起動ボタンのイベント処理関数
 *              Event handling function for script editor start button
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // スクリプトエディタを表示
    scriptEditorModalBootUseCase();
};