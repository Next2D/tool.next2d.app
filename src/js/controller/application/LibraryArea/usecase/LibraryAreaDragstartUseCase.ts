import { execute as screenStageAreaAllDisplayObjectInactiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectInactiveService";

/**
 * @description ライブラリのファイル移動時は全てのDisplayObjectを非アクティブ化
 *              When moving files in the library, deactivate all DisplayObjects
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 全てのイベントをキャンセル
    event.stopPropagation();

    // 全てのDisplayObjectを非アクティブ化
    screenStageAreaAllDisplayObjectInactiveService();
};