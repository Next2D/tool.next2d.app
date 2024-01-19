import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import type { MenuImpl } from "@/interface/MenuImpl";
import { execute as initializeGlobal } from "@/global/application/Initialize";
import { execute as initializeTool } from "@/tool/application/Initialize";
import { execute as initializeMenu } from "@/menu/application/Initialize";
import { execute as initializeScreen } from "@/screen/application/Initialize";
import { execute as initializeTimeline } from "@/timeline/application/Initialize";
import { execute as initializeLanguage } from "@/language/application/Initialize";
import { execute as initializeCore } from "@/core/application/Initialize";
import { execute as initializeUser } from "@/user/application/Initialize";
import { execute as initializeShortcut } from "@/shortcut/application/Initialize";
import { execute as initializeController } from "@/controller/application/Initialize";
import { execute as initializeView } from "@/view/application/Initialize";
import { execute as initializeShare } from "@/share/application/Initialize";
import { execute as bootUser } from "@/user/application/Boot";
import { execute as detailModalRegisterFadeEventService } from "@/menu/application/DetailModal/service/DetailModalRegisterFadeEventService";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";
import {
    $getAllWorkSpace,
    $getCurrentWorkSpace
} from "@/core/application/CoreUtil";
import { ExternalApplication } from "./external/ExternalApplication";
import { $useSocket } from "./share/application/ShareUtil";

/**
 * @description 初期起動関数
 *              initial invoking function
 * @private
 */
const initializes: Function[] = [
    initializeGlobal,
    initializeShortcut,
    initializeMenu,
    initializeUser,
    initializeCore,
    initializeScreen,
    initializeTool,
    initializeTimeline,
    initializeController,
    initializeView,
    initializeLanguage,
    initializeShare
];

/**
 * @description システム起動関数
 *              system invocation function
 * @private
 */
const boots: Function[] = [
    bootUser
];

/**
 * @description 外部APIクラスの起動関数
 *              External API class invocation function
 *
 * @return {Promise}
 * @method
 * @private
 */
const external = (): void =>
{
    if ("nl" in window) {
        return ;
    }
    window.nl = new ExternalApplication();
};

/**
 * @description イベント登録登録などの初期起動関数
 *              Initial startup functions such as event registration registration
 *
 * @return {Promise}
 * @method
 * @public
 */
export const initialize = async (): Promise<void> =>
{
    // 初期起動関数を実行
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < initializes.length; ++idx) {
        const initialize: Function = initializes[idx];
        promises.push(initialize());
    }

    // 初期起動関数が全て完了するまで待機
    await Promise.all(promises);

    // 進行メニューを表示
    const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.update();
};

/**
 * @description システム起動関数を実行
 *              Activate menu functions
 *
 * @return {Promise}
 * @method
 * @public
 */
export const boot = async (): Promise<void> =>
{
    if ($useSocket()) {
        const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
        if (menu) {
            menu.message = "Socket connection...";
        }
        return ;
    }

    const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
    if (menu) {
        menu.message = "Booting the system.";
    }

    // システム起動関数を実行
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < boots.length; ++idx) {
        const boot: Function = boots[idx];
        promises.push(boot());
    }

    // システム起動関数が全て完了するまで待機
    await Promise.all(promises);
};

/**
 * @description 全体の機能を起動
 *              Activate the entire function
 *
 * @return {Promise}
 * @method
 * @public
 */
export const run = async (): Promise<void> =>
{
    if ($useSocket()) {
        return ;
    }

    const promises: Promise<void>[] = [];

    // 起動したWorkSpaceの初期関数を実行
    const workSpaces: WorkSpace[] = $getAllWorkSpace();
    for (let idx: number = 0; idx < workSpaces.length; ++idx) {
        const workSpace: WorkSpace = workSpaces[idx];
        promises.push(workSpace.initialize());
    }

    // 初期起動関数が終了するまで待機
    await Promise.all(promises);

    // 選択されたWorkSpaceを起動
    await $getCurrentWorkSpace().run();

    // 初期のDOMを対象に説明モーダルのイベントをセット
    await detailModalRegisterFadeEventService(document);

    // 言語を適用
    await languageTranslationService(document);

    // 外部APIクラスを起動
    external();
};