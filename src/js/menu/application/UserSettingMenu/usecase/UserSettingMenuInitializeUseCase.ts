import { execute as userSettingMenuUpdateOffsetService } from "../service/UserSettingMenuUpdateOffsetService";
import { execute as userSettingMenuLayerSettingInitializeUseCase } from "./UserSettingMenuLayerSettingInitializeUseCase";
import { execute as userSettingMenuPublishTypeInitializeUseCase } from "./UserSettingMenuPublishTypeInitializeUseCase";
import { execute as userSettingMenuModalSettingInitializeUseCase } from "./UserSettingMenuModalSettingInitializeUseCase";
import { execute as userSettingMenuLanguageSettingInitializeUseCase } from "./UserSettingMenuLanguageSettingInitializeUseCase";
import { execute as userSettingMenuVersionService } from "../service/UserSettingMenuVersionService";
import { execute as userSettingMenuShortcutSettingInitializeUseCase } from "./UserSettingMenuShortcutSettingInitializeUseCase";
import { execute as userSettingMenuShareSettingInitializeUseCase } from "./UserSettingMenuShareSettingInitializeUseCase";

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

    // 非表示レイヤーのユースケースを実行
    userSettingMenuLayerSettingInitializeUseCase();

    // 書き出しフォーマットのユースケースを実行
    userSettingMenuPublishTypeInitializeUseCase();

    // モーダル表示のユースケースを実行
    userSettingMenuModalSettingInitializeUseCase();

    // 言語設定のユースケースを実行
    userSettingMenuLanguageSettingInitializeUseCase();

    // ショートカットメニューのユースケースを実行
    userSettingMenuShortcutSettingInitializeUseCase();

    // 画面共有ボタンのユースケースを実行
    userSettingMenuShareSettingInitializeUseCase();

    // バージョン情報を更新
    userSettingMenuVersionService();
};