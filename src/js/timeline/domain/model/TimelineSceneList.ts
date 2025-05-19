import type { ITimelineSceneListParentObject } from "@/interface/ITimelineSceneListParentObject";

/**
 * @description タイムラインのレイヤーの管理クラス
 *              Management class for timeline layers
 *
 * @class
 * @public
 */
class TimelineSceneList
{
    /**
     * @description MovieClipのcharacterを格納した配列を返却
     *              Returns an array containing the character of MovieClip
     *
     * @return {array}
     * @readonly
     * @public
     */
    public readonly parents: ITimelineSceneListParentObject[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {

        this.parents = [];
    }
}

export const timelineSceneList = new TimelineSceneList();