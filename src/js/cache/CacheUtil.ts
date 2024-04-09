import { $poolCanvas } from "@/global/GlobalUtil";

/**
 * @description canvasをキャッシュのマップデータ
 *              Map data of canvas cache
 *
 * @private
 */
const $cacheStore = new Map<number, Map<number, Map<string, HTMLCanvasElement>>>();

/**
 * @description キャッシュのcanvasを取得
 *              Get the cached canvas
 *
 * @param  {nunber} work_space_id
 * @param  {nunber} library_id
 * @param  {string} cache_key
 * @return {HTMLCanvasElement | null}
 * @method
 * @public
 */
export const $getCacheCanvas = (
    work_space_id: number,
    library_id: number,
    cache_key: string
): HTMLCanvasElement | null => {

    if (!$cacheStore.has(work_space_id)) {
        return null;
    }

    const workSpaceCache = $cacheStore.get(work_space_id) as NonNullable<Map<number, Map<string, HTMLCanvasElement>>>;
    if (!workSpaceCache.has(library_id)) {
        return null;
    }

    const libraryCacheMap = workSpaceCache.get(library_id) as NonNullable<Map<string, HTMLCanvasElement>>;

    return libraryCacheMap.has(cache_key)
        ? libraryCacheMap.get(cache_key) as NonNullable<HTMLCanvasElement>
        : null;
};

/**
 * @description 指定のライブラリIDで生成したcanvasをキャッシュとして保存
 *              Save the canvas generated with the specified library ID as a cache
 *
 * @param  {nunber} work_space_id
 * @param  {nunber} library_id
 * @param  {string} cache_key
 * @param  {HTMLCanvasElement} canvas
 * @return {void}
 * @method
 * @public
 */
export const $setCacheCanvas = (
    work_space_id: number,
    library_id: number,
    cache_key: string,
    canvas: HTMLCanvasElement
): void => {

    if (!$cacheStore.has(work_space_id)) {
        $cacheStore.set(work_space_id, new Map());
    }

    const workSpaceCache = $cacheStore.get(work_space_id) as NonNullable<Map<number, Map<string, HTMLCanvasElement>>>;
    if (!workSpaceCache.has(library_id)) {
        workSpaceCache.set(library_id, new Map());
    }

    const libraryCacheMap = workSpaceCache.get(library_id) as NonNullable<Map<string, HTMLCanvasElement>>;
    libraryCacheMap.set(cache_key, canvas);
};

/**
 * @description 指定のライブラリIDのキャッシュを全て削除
 *              Delete all caches for the specified library ID
 *
 * @param  {nunber} work_space_id
 * @param  {nunber} library_id
 * @return {void}
 * @method
 * @public
 */
export const $removeLibraryCache = (work_space_id: number, library_id: number): void =>
{
    if (!$cacheStore.has(work_space_id)) {
        return ;
    }

    const workSpaceCache = $cacheStore.get(work_space_id) as NonNullable<Map<number, Map<string, HTMLCanvasElement>>>;
    if (!workSpaceCache.has(library_id)) {
        return ;
    }

    const libraryCacheMap = workSpaceCache.get(library_id) as NonNullable<Map<string, HTMLCanvasElement>>;
    for (const canvas of libraryCacheMap.values()) {
        $poolCanvas(canvas);
    }

    workSpaceCache.delete(library_id);
};

/**
 * @description 指定のWorkSpcaeのキャッシュを全て削除
 *              Delete all caches for the specified WorkSpcae
 *
 * @param  {nunber} work_space_id
 * @return {void}
 * @method
 * @public
 */
export const $removeWorkSpaceCache = (work_space_id: number): void =>
{
    if (!$cacheStore.has(work_space_id)) {
        return ;
    }

    const workSpaceCache = $cacheStore.get(work_space_id) as NonNullable<Map<number, Map<string, HTMLCanvasElement>>>;
    for (const libraryCacheMap of workSpaceCache.values()) {
        for (const canvas of libraryCacheMap.values()) {
            $poolCanvas(canvas);
        }
    }

    // WorkSpcaeのキャッシュを全て削除
    $cacheStore.delete(work_space_id);
};