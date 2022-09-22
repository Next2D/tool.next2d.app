/**
 * フォルダーの開閉状態の固定値
 * Fixed value for folder open/closed status
 *
 * @class
 * @memberOf instance
 */
class FolderType
{
    /**
     * @description フォルダーを開いた状態
     *              Folder open state
     *
     * @return {string}
     * @static
     * @const
     */
    static get OPEN ()
    {
        return "open";
    }

    /**
     * @description フォルダを閉じた状態
     *              Folder close state
     *
     * @return {string}
     * @static
     * @const
     */
    static get CLOSE ()
    {
        return "close";
    }
}
