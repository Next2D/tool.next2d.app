import { execute as tool } from "./tool/application/Initialize";
import { execute as menu } from "./menu/application/Initialize";
import { execute as view } from "./view/application/Initialize";
import { execute as timeline } from "./timeline/application/Initialize";
import { execute as language } from "./language/application/Initialize";
import { execute as core } from "./core/application/Initialize";
import { execute as user } from "./user/application/Initialize";
import { WorkSpace } from "./core/domain/model/WorkSpace";

const executes: Function[] = [
    user,
    core,
    view,
    timeline,
    tool,
    menu,
    language // fixed logic
];

/**
 * @description 全体の機能の起動を管理する関数
 *              Functions that manage the activation of the overall function
 *
 * @return {Promise}
 * @method
 * @public
 */
export const initialize = (): Promise<void[]> =>
{
    // 起動タスクを実行
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < executes.length; ++idx) {
        const initialize: Function = executes[idx];
        promises.push(initialize());
    }

    return Promise.all(promises);
};

/**
 * @description 全体の機能を起動
 *              Activate the entire function
 *
 * @return {void}
 * @method
 * @public
 */
export const run = (): void =>
{
    const workSpace = new WorkSpace();
    workSpace.run();
};