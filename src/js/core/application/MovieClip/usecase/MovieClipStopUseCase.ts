import { execute as screenAreaRemoveAllDisplayObjectService } from "@/screen/application/ScreenArea/service/ScreenAreaRemoveAllDisplayObjectService";

/**
 * @description MovieClipを停止処理のユースケース
 *              MovieClip stop processing use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // スクリーンエリアのDisplayObjectを全て削除
    screenAreaRemoveAllDisplayObjectService();
};