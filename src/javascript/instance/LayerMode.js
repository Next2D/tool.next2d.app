/**
 * レイヤーの型の固定値
 * Fixed value of the layer type
 *
 * @class
 * @memberOf instance
 */
class LayerMode
{
    /**
     * @description 通常レイヤー
     *              Normal Layer
     *
     * @return {number}
     * @static
     * @const
     */
    static get NORMAL ()
    {
        return 0;
    }

    /**
     * @description マスクレイヤー
     *              Mask Layer
     *
     * @return {number}
     * @static
     * @const
     */
    static get MASK ()
    {
        return 1;
    }

    /**
     * @description Nested layers of masks
     *              Normal Layer
     *
     * @return {number}
     * @static
     * @const
     */
    static get MASK_IN ()
    {
        return 2;
    }

    /**
     * @description ガイドレイヤー
     *              Guide Layer
     *
     * @return {number}
     * @static
     * @const
     */
    static get GUIDE ()
    {
        return 3;
    }

    /**
     * @description ガイドの入れ子になっているレイヤー
     *              Nested layers of guides
     *
     * @return {number}
     * @static
     * @const
     */
    static get GUIDE_IN ()
    {
        return 4;
    }
}
