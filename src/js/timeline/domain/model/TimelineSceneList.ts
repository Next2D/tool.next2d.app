import type { TimelineSceneListParentObjectImpl } from "@/interface/TimelineSceneListParentObjectImpl";

/**
 * @description タイムラインのレイヤーの管理クラス
 *              Management class for timeline layers
 *
 * @class
 * @public
 */
class TimelineSceneList
{
    private readonly _$parents: TimelineSceneListParentObjectImpl[];

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
        this._$parents = [];
    }

    /**
     * @description MovieClipのcharacterを格納した配列を返却
     *              Returns an array containing the character of MovieClip
     *
     * @return {array}
     * @readonly
     * @public
     */
    get parents (): TimelineSceneListParentObjectImpl[]
    {
        return this._$parents;
    }
}

export const timelineSceneList = new TimelineSceneList();