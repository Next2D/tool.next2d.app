import { execute as userSettingMenuUpdateOffsetService } from "../service/UserSettingMenuUpdateOffsetService";

/**
 * @description setTimerのIDを管理
 *              Manage setTimer IDs
 *
 * @type {number}
 * @private
 */
let $timerId: NodeJS.Timeout | number = 0;

/**
 * @description ユーザー設定のメニュー画面の初期起動時のユースケース
 *              Use case for initial startup of the user settings menu screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 現在のElementの配置からoffsetをセット
    userSettingMenuUpdateOffsetService();

    // リサイズ時には座標を再取得
    window.addEventListener("resize", (): void =>
    {
        clearTimeout($timerId);
        $timerId = setTimeout(() =>
        {
            userSettingMenuUpdateOffsetService();
        }, 200);
    });
};