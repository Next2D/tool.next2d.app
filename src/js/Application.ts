import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import type { MenuImpl } from "@/interface/MenuImpl";
import { execute as initializeGlobal } from "@/global/application/Initialize";
import { execute as initializeTool } from "@/tool/application/Initialize";
import { execute as initializeMenu } from "@/menu/application/Initialize";
import { execute as initializeView } from "@/view/application/Initialize";
import { execute as initializeScreen } from "@/screen/application/Initialize";
import { execute as initializeTimeline } from "@/timeline/application/Initialize";
import { execute as initializeLanguage } from "@/language/application/Initialize";
import { execute as initializeCore } from "@/core/application/Initialize";
import { execute as initializeUser } from "@/user/application/Initialize";
import { execute as initializeShortcut } from "@/shortcut/application/Initialize";
import { execute as bootUser } from "@/user/application/Boot";
import { execute as detailModalRegisterFadeEventService } from "@/menu/application/DetailModal/service/DetailModalRegisterFadeEventService";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";
import {
    $getAllWorkSpace,
    $getCurrentWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description 初期起動関数
 *              initial invoking function
 * @private
 */
const initializes: Function[] = [
    initializeLanguage, // OK
    initializeGlobal, // OK
    initializeShortcut, // OK
    initializeMenu, // OK
    initializeUser, // OK
    initializeCore, // OK
    initializeView, // OK
    initializeScreen, // OK
    initializeTimeline,
    initializeTool
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
 * @description 全体の機能の起動を管理する関数
 *              Functions that manage the activation of the overall function
 *
 * @return {Promise}
 * @method
 * @public
 */
export const initialize = (): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        // 初期起動関数を実行
        const promises: Promise<void>[] = [];
        for (let idx: number = 0; idx < initializes.length; ++idx) {
            const initialize: Function = initializes[idx];
            promises.push(initialize());
        }

        // 初期起動関数が全て完了するまで待機
        Promise
            .all(promises)
            .then((): void =>
            {
                const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
                if (menu) {
                    menu.update();
                }

                // 終了
                resolve();
            });
    });
};

/**
 * @description システム起動関数を実行
 *              Activate menu functions
 *
 * @return {Promise}
 * @method
 * @public
 */
export const boot = (): Promise<void> =>
{
    const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
    if (menu) {
        menu.message = "Booting the system.";
    }

    return new Promise((resolve): void =>
    {
        const promises: Promise<void>[] = [];
        // システム起動関数を実行
        for (let idx: number = 0; idx < boots.length; ++idx) {
            const boot: Function = boots[idx];
            promises.push(boot());
        }

        // システム起動関数が全て完了するまで待機
        Promise
            .all(promises)
            .then((): void =>
            {
                // 終了
                resolve();
            });
    });
};

/**
 * @description 全体の機能を起動
 *              Activate the entire function
 *
 * @return {Promise}
 * @method
 * @public
 */
export const run = (): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        const promises: Promise<void>[] = [];

        // 起動したWorkSpaceの初期関数を実行
        const workSpaces: WorkSpace[] = $getAllWorkSpace();
        for (let idx = 0; idx < workSpaces.length; ++idx) {
            const workSpace: WorkSpace = workSpaces[idx];
            promises.push(workSpace.initialize());
        }

        // 初期起動関数が終了するまで待機
        Promise
            .all(promises)
            .then((): Promise<void> =>
            {
                // 選択されたWorkSpaceを起動
                return $getCurrentWorkSpace().run();
            })
            .then((): Promise<void> =>
            {
                // 初期のDOMを対象に説明モーダルのイベントをセット
                return detailModalRegisterFadeEventService(document);
            })
            .then((): Promise<void> =>
            {
                // 言語を適用
                return languageTranslationService();
            })
            .then(resolve);
    });
};