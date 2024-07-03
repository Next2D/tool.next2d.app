/**
 * @description 書き出しで利用したライブラリIDと書き出し先のIDのマッピング
 *              Mapping of library ID used in export and destination ID
 *
 * @type {Map<number, number>}
 * @private
 */
const $useLibraryIds: Map<number, number> = new Map<number, number>();

/**
 * @description 書き出しで利用したライブラリIDと書き出し先のIDのマッピングを返却
 *              Return the mapping of library ID used in export and destination ID
 *
 * @return {Map<number, number>}
 * @method
 * @public
 */
export const $getUseLibraryIds = (): Map<number, number> =>
{
    return $useLibraryIds;
};

/**
 * @description 書き出しで利用したライブラリIDと書き出し先のIDのマッピングを初期化
 *              Initialize the mapping of library ID used in export and destination
 *
 * @return {Map<number, number>}
 * @method
 * @public
 */
export const $clearUseLibraryIds = (): void =>
{
    $useLibraryIds.clear();
};