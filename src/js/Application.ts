import { execute as tool } from "./tool/application/Initialize";
import { execute as menu } from "./menu/application/Initialize";
import { execute as view } from "./view/application/Initialize";
import { execute as timeline } from "./timeline/application/Initialize";
import { execute as language } from "./language/application/Initialize";
import { execute as core } from "./core/application/Initialize";
import { execute as user } from "./user/application/Initialize";
import { WorkSpace } from "./core/domain/model/WorkSpace";
import { $getMenu } from "./menu/application/MenuUtil";
import { $PROGRESS_MENU_NAME } from "./config/MenuConfig";
import { MenuImpl } from "./interface/MenuImpl";
import { ProgressMenu } from "./menu/domain/model/ProgressMenu";
import { $getAllWorkSpace, $getCurrentWorkSpace } from "./core/application/CoreUtil";

const executes: Function[] = [
    menu,
    user,
    core,
    view,
    timeline,
    tool
];

/**
 * @description 全体の機能の起動を管理する関数
 *              Functions that manage the activation of the overall function
 *
 * @return {Promise}
 * @method
 * @public
 */
export const initialize = async (): Promise<void> =>
{
    // 言語ファイルを取得
    await language();

    // 起動タスクを実行
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < executes.length; ++idx) {
        const initialize: Function = executes[idx];
        promises.push(initialize());
    }

    // 起動タスクが全て完了するまで待機
    await Promise.all(promises);

    return await Promise.resolve();
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
    const promises: Promise<void>[] = [];

    // 起動したWorkSpaceの初期関数を実行
    const workSpaces: WorkSpace[] = $getAllWorkSpace();
    for (let idx = 0; idx < workSpaces.length; ++idx) {
        const workSpace: WorkSpace = workSpaces[idx];
        promises.push(workSpace.initialize());
    }

    // 初期起動関数が終了するまで待機
    await Promise.all(promises);

    // 選択されたWorkSpaceを起動
    $getCurrentWorkSpace()
        .run()
        .then((): void => {
            const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
            if (!menu) {
                return;
            }

            // 進行状況メニューを非表示に
            menu.hide();
        });
};