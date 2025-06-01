import { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IBounds } from "@/interface/IBounds";

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
export const $changeCurrentWorkSpace = async (work_space: WorkSpace): Promise<void> =>
{
    if ($workSpace) {
        // 同一の場合は終了
        if ($workSpace.id === work_space.id) {
            return ;
        }

        // 現在のプロジェクトを停止
        await $workSpace.stop();
    }

    // 指定のプロジェクトを起動
    $workSpace = work_space;
    await $workSpace.run();
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
 * @params  {boolean} active
 * @returns {Promise}
 * @method
 * @public
 */
export const $removeWorkSpace = async (
    work_space: WorkSpace,
    active: boolean
): Promise<void> => {

    const index: number = $workSpaces.indexOf(work_space);
    if (index === -1) {
        return ;
    }

    $workSpaces.splice(index, 1);

    // 他のプロジェクトがあれば起動
    if ($workSpaces.length) {

        // 削除するプロジェクトがアクティブなら別のプロジェクトを起動
        if (active) {
            $workSpace = null;
            await $changeCurrentWorkSpace($workSpaces[0] as NonNullable<WorkSpace>);
            return;
        }

        return ;
    }

    // 起動中のWorkSpaceがなければ自動的に起動
    WorkSpace.workSpaceId = 1;
    const workSpace: WorkSpace = $createWorkSpace();

    // 削除するプロジェクトを停止して、新しいプロジェクト起動
    await work_space.stop();

    // 初期化して起動
    await workSpace.initialize();
    await workSpace.run();
};

/**
 * @description 現在起動中のすべてのWorkSpaceを停止して、配列を初期化する
 *              Stop all currently running WorkSpaces and initialize the array
 *
 * @returns {Promise}
 * @method
 * @public
 */
export const $removeAllWorkSpace = async (): Promise<void> =>
{
    for (let idx = 0; idx < $workSpaces.length; ++idx) {

        const workSpace = $workSpaces[idx];

        // プロジェクトを停止
        await workSpace.stop();

        // タブを削除
        workSpace.screenTab.remove();
    }

    // 配列を初期化
    $workSpaces.length = 0;
};

/**
 * @description AudioContextの本体
 *              AudioContext body
 *
 * @type {AudioContext}
 * @private
 */
let $audioContext: AudioContext = new AudioContext();

/**
 * @description AudioContextを起動
 *              Launch AudioContext
 *
 * @returns {void}
 * @method
 * @public
 */
export const $bootAudioContext = (): void =>
{
    // 初回だけのイベントなので起動したらイベントを削除
    window.removeEventListener("pointerup", $bootAudioContext);
    $audioContext = new AudioContext();
};

/**
 * @description AudioContextを返却
 *              Return AudioContext
 *
 * @returns {AudioContext | null}
 * @method
 * @public
 */
export const $getAudioContext = (): AudioContext | null =>
{
    return $audioContext;
};

/**
 * @description 指定の座標を元にBoundsを生成
 *              Generate Bounds based on the specified coordinates
 *
 * @param  {number} x_min
 * @param  {number} y_min
 * @param  {number} x_max
 * @param  {number} y_max
 * @param  {Float32Array} matrix
 * @return {object}
 * @method
 * @public
 */
export const $getMatrixBounds = (
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    matrix: Float32Array
): IBounds => {

    const x0 = x_max * matrix[0] + y_max * matrix[2] + matrix[4];
    const x1 = x_max * matrix[0] + y_min * matrix[2] + matrix[4];
    const x2 = x_min * matrix[0] + y_max * matrix[2] + matrix[4];
    const x3 = x_min * matrix[0] + y_min * matrix[2] + matrix[4];
    const y0 = x_max * matrix[1] + y_max * matrix[3] + matrix[5];
    const y1 = x_max * matrix[1] + y_min * matrix[3] + matrix[5];
    const y2 = x_min * matrix[1] + y_max * matrix[3] + matrix[5];
    const y3 = x_min * matrix[1] + y_min * matrix[3] + matrix[5];

    return {
        "xMin": Math.min( Number.MAX_VALUE, x0, x1, x2, x3),
        "xMax": Math.max(-Number.MAX_VALUE, x0, x1, x2, x3),
        "yMin": Math.min( Number.MAX_VALUE, y0, y1, y2, y3),
        "yMax": Math.max(-Number.MAX_VALUE, y0, y1, y2, y3)
    };
};

/**
 * @description 複数のBoundsからBoundingBoxを計算
 *              Calculate the BoundingBox from multiple Bounds
 *
 * @param  {array} bounding_boxs
 * @return {object}
 * @method
 * @public
 */
export const $calcBoundingBox = (bounding_boxs: IBounds[]): IBounds =>
{
    let xMin =  Number.MAX_VALUE;
    let yMin =  Number.MAX_VALUE;
    let xMax = -Number.MAX_VALUE;
    let yMax = -Number.MAX_VALUE;

    for (let idx = 0; idx < bounding_boxs.length; idx++) {
        const bounds = bounding_boxs[idx];
        xMin = Math.min(xMin, bounds.xMin);
        yMin = Math.min(yMin, bounds.yMin);
        xMax = Math.max(xMax, bounds.xMax);
        yMax = Math.max(yMax, bounds.yMax);
    }

    return {
        "xMin": xMin,
        "yMin": yMin,
        "xMax": xMax,
        "yMax": yMax
    };
};

/**
 * @description 2次元行列の掛け算
 *              Multiplication of 2D matrices
 *
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @return {Float32Array}
 * @method
 * @public
 */
export const $multiplyMatrix = (a: Float32Array, b: Float32Array): Float32Array =>
{
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];

    return new Float32Array([
        a0 * b0 + a2 * b1,
        a1 * b0 + a3 * b1,
        a0 * b2 + a2 * b3,
        a1 * b2 + a3 * b3,
        a0 * b4 + a2 * b5 + a4,
        a1 * b4 + a3 * b5 + a5
    ]);
};