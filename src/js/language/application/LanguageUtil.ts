/**
 * @description 変換前と変換後のテキストのマップデータ
 *              Map data of text before and after conversion
 *
 * @member {Map}
 * @return {Map}
 * @public
 */
let $mapping: Map<string, string> = new Map();

/**
 * @description 取得した言語データをマップに登録
 *              Register acquired language data in the map
 *
 * @return {Map}
 * @method
 * @public
 */
export const $getMapping = (): Map<string, string> =>
{
    return $mapping;
};

/**
 * @description 取得した言語データをマップに登録
 *              Register acquired language data in the map
 *
 * @param  {array} object
 * @return {string}
 * @method
 * @public
 */
export const $setMapping = (object: any): void =>
{
    $mapping = new Map(object);
};

/**
 * @description 指定した文字列が言語マップにヒットした場合変換して返却
 *              If the specified string hits the language map, it is converted and returned.
 *
 * @param  {string} value
 * @return {string}
 * @method
 * @public
 */
export const $replace = (value: string): string =>
{
    return $mapping.has(value)
        ? $mapping.get(value) || value
        : value;
};