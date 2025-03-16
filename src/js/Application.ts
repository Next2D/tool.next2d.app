import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { execute as initializeGlobal } from "@/global/application/Initialize";
import { execute as initializeTool } from "@/tool/application/Initialize";
import { execute as initializeMenu } from "@/menu/application/Initialize";
import { execute as initializeScreen } from "@/screen/application/Initialize";
import { execute as initializeTimeline } from "@/timeline/application/Initialize";
import { execute as initializeLanguage } from "@/language/application/Initialize";
import { execute as initializeCore } from "@/core/application/Initialize";
import { execute as initializeShortcut } from "@/shortcut/application/Initialize";
import { execute as initializeController } from "@/controller/application/Initialize";
import { execute as initializeView } from "@/view/application/Initialize";
import { execute as initializeShare } from "@/share/Initialize";
import { execute as bootUser } from "@/user/application/UserBoot";
import { execute as detailModalRegisterFadeEventUseCase } from "@/menu/application/DetailModal/usecase/DetailModalRegisterFadeEventUseCase";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";
import { execute as registerWindowResizeEventUseCase } from "@/global/application/usecase/GlobalWindowResizeEventUseCase";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";
import { ExternalApplication } from "./external/ExternalApplication";
import { $useSocket } from "./share/ShareUtil";
import {
    $getAllWorkSpace,
    $getCurrentWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description 初期起動関数
 *              initial invoking function
 *
 * @type {Function[]}
 * @private
 */
const initializes: Function[] = [
    initializeGlobal,
    initializeShortcut,
    initializeMenu,
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
 *
 * @type {Function[]}
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
    (window as any).nl = new ExternalApplication();
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
    for (let idx = 0; idx < initializes.length; ++idx) {
        const initialize = initializes[idx];
        if (!initialize) {
            continue ;
        }
        await initialize();
    }

    // 進行メニューを表示
    const menu = $getMenu<ProgressMenu>($PROGRESS_MENU_NAME);
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
        const menu = $getMenu<ProgressMenu>($PROGRESS_MENU_NAME);
        if (menu) {
            menu.message = "Socket connection...";
        }
        return ;
    }

    const menu = $getMenu<ProgressMenu>($PROGRESS_MENU_NAME);
    if (menu) {
        menu.message = "Booting the system.";
    }

    // システム起動関数を実行
    for (let idx = 0; idx < boots.length; ++idx) {
        const boot = boots[idx];
        if (!boot) {
            continue ;
        }
        await boot();
    }
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

    // 起動したWorkSpaceの初期関数を実行
    const workSpaces = $getAllWorkSpace();
    for (let idx = 0; idx < workSpaces.length; ++idx) {
        const workSpace = workSpaces[idx];
        if (!workSpace) {
            continue ;
        }
        await workSpace.initialize();
    }

    // リサイズイベントを登録
    registerWindowResizeEventUseCase();

    // 選択されたWorkSpaceを起動
    await $getCurrentWorkSpace().run();

    // 初期のDOMを対象に説明モーダルのイベントをセット
    await detailModalRegisterFadeEventUseCase(document);

    // 言語を適用
    languageTranslationService(document);

    // 外部APIクラスを起動
    external();
};