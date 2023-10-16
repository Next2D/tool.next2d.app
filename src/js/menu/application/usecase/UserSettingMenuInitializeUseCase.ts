import { execute as userSettingMenuUpdateOffsetService } from "../service/UserSettingMenuUpdateOffsetService";
import { execute as userSettingMenuLayerSettingInitializeUseCase } from "./UserSettingMenuLayerSettingInitializeUseCase";
import { execute as userSettingMenuPublishTypeInitializeUseCase } from "./UserSettingMenuPublishTypeInitializeUseCase";
import { execute as userSettingMenuModalSettingInitializeUseCase } from "./UserSettingMenuModalSettingInitializeUseCase";
import { execute as userSettingMenuVersionService } from "../service/UserSettingMenuVersionService";

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

    // 非表示レイヤーのユースケースを実行
    userSettingMenuLayerSettingInitializeUseCase();

    // 書き出しフォーマットのユースケースを実行
    userSettingMenuPublishTypeInitializeUseCase();

    // モーダル表示のユースケースを実行
    userSettingMenuModalSettingInitializeUseCase();

    // バージョン情報を更新
    userSettingMenuVersionService();
};