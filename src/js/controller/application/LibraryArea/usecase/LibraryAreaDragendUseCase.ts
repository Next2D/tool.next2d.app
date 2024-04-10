import { execute as screenStageAreaAllDisplayObjectActiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectActiveService";

/**
 * @description ライブラリのファイル移動終了時に全てのDisplayObjectをアクティブ化
 *              Activate all DisplayObjects when moving files in the library
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 全てのイベントをキャンセル
    event.preventDefault();
    event.stopPropagation();

    // 全てのDisplayObjectをアクティブ化
    screenStageAreaAllDisplayObjectActiveService();
};