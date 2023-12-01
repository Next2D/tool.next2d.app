import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 起動中のWorkSpace配列
 *              WorkSpace array during startup
 * @private
 */
const $workSpaces: WorkSpace[] = [];

/**
 * @description 起動中のWorkSpaceを全て返却
 *              Return all running WorkSpaces
 *
 * @returns {array}
 * @method
 * @public
 */
export const $getAllWorkSpace = (): WorkSpace[] =>
{
    return $workSpaces;
};

/**
 * @description 現在起動中のWorkSpace
 *              WorkSpace currently running
 *
 * @type {WorkSpace}
 * @default null
 * @private
 */
let $workSpace: WorkSpace | null = null;

/**
 * @description 現在起動中のWorkSpaceを返却
 *              Returns the currently running WorkSpace
 *
 * @returns {WorkSpace | null}
 * @method
 * @public
 */
export const $getCurrentWorkSpace = (): WorkSpace =>
{
    return $workSpace as NonNullable<WorkSpace>;
};

/**
 * @description 現在起動中のWorkSpaceをセット
 *              Set the currently running WorkSpace
 *
 * @params  {WorkSpace} work_space
 * @returns {Promise}
 * @method
 * @public
 */
export const $changeCurrentWorkSpace = (work_space: WorkSpace): Promise<void> =>
{
    return new Promise((reslove): void =>
    {
        if ($workSpace) {

            // 同一の場合は終了
            if ($workSpace.id === work_space.id) {
                return reslove();
            }

            // 現在のプロジェクトを停止
            $workSpace
                .stop()
                .then((): void =>
                {
                    // 指定のプロジェクトを起動
                    $workSpace = work_space;
                    $workSpace
                        .run()
                        .then(reslove);
                });
        } else {
            // 指定のプロジェクトを起動
            $workSpace = work_space;
            $workSpace.run().then(reslove);
        }
    });
};

/**
 * @description 指定のWorkSpaceを返却
 *              Return the specified WorkSpace
 *
 * @params  {number} id
 * @returns {WorkSpace | null}
 * @method
 * @public
 */
export const $getWorkSpace = (id: number): WorkSpace | null =>
{
    for (let idx: number = 0; idx < $workSpaces.length; ++idx) {
        const workSpace = $workSpaces[idx];
        if (workSpace.id !== id) {
            continue;
        }
        return workSpace;
    }
    return null;
};

/**
 * @description 生成したWorkSpaceを配列に登録
 *              Register the generated WorkSpace in the array
 *
 * @param  {WorkSpace} workSpace
 * @return {void}
 * @method
 * @public
 */
export const $registerWorkSpace = (workSpace: WorkSpace): void =>
{
    // 最初のWorkSpaceは起動対象として登録
    if (!$workSpaces.length) {
        $workSpace = workSpace;
    }
    $workSpaces.push(workSpace);
};

/**
 * @description 新規のWorkSpaceを生成
 *              Create a new WorkSpace
 *
 * @returns {WorkSpace}
 * @method
 * @public
 */
export const $createWorkSpace = (): WorkSpace =>
{
    const workSpace: WorkSpace = new WorkSpace();

    // 配列に登録
    $workSpaces.push(workSpace);

    // 最初のWorkSpaceであれば起動中にセット
    if ($workSpaces.length === 1) {
        $workSpace = workSpace;
    }

    return workSpace;
};

/**
 * @description 指定のWorkSpaceを終了
 *              Exit the specified WorkSpace
 *
 * @params  {WorkSpace} work_space
 * @returns {Promise}
 * @method
 * @public
 */
export const $removeWorkSpace = (work_space: WorkSpace): Promise<void> =>
{
    return new Promise((reslove): void =>
    {
        const index: number = $workSpaces.indexOf(work_space);
        if (index === -1) {
            return reslove();
        }

        $workSpaces.splice(index, 1);

        // 他のプロジェクトがあれば起動
        if ($workSpaces.length) {

            // 削除するプロジェクトがアクティブなら別のプロジェクトを起動
            if (work_space.active) {
                $workSpace = null;
                return $changeCurrentWorkSpace($workSpaces[0] as NonNullable<WorkSpace>).then(reslove);
            }

            return reslove();
        }

        // 起動中のWorkSpaceがなければ自動的に起動
        const workSpace: WorkSpace = $createWorkSpace();

        workSpace
            .initialize()
            .then((): void =>
            {
                workSpace
                    .run()
                    .then(reslove);
            });
    });
};