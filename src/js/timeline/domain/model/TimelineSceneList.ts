/**
 * @description タイムラインのレイヤーの管理クラス
 *              Management class for timeline layers
 *
 * @class
 * @public
 */
class TimelineSceneList
{
    private readonly _$scenes: number[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$scenes = [];
    }

    /**
     * @description MovieClipのIDを格納した配列を返却
     *              Returns an array containing the MovieClip's ID
     *
     * @return {array}
     * @readonly
     * @public
     */
    get scenes (): number[]
    {
        return this._$scenes;
    }

    /**
     * @description MovieClipのIDを配列に格納、重複がないようにチェックを行う
     *              Store MovieClip IDs in array, check for duplicates
     *
     * @param  {number} id
     * @return {void}
     * @method
     * @public
     */
    addSceneId (id: number): void
    {
        if (this._$scenes.indexOf(id) > -1) {
            return ;
        }
        this._$scenes.push(id);
    }
}

export const timelineSceneList = new TimelineSceneList();