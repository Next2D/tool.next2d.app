import { execute as screenStageAreaAllDisplayObjectInactiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectInactiveService";

/**
 * @description シェイプの角丸矩形ツールの起動イベント
 *              Shape Rounded Rectangle Tool startup event
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 配置された全てのDisplayObjectのイベント無効化
    screenStageAreaAllDisplayObjectInactiveService();
};