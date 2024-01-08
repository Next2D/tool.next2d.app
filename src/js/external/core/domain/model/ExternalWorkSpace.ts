import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import { execute as externalWorkSpaceUpdateNameUseCase } from "@/external/core/application/ExternalWorkSpace/usecase/ExternalWorkSpaceUpdateNameUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description WorkSpaceの外部APIクラス
 *              WorkSpace external API classes
 *
 * @class
 */
export class ExternalWorkSpace
{
    private readonly _$workSpace: WorkSpace;

    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace)
    {
        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;
    }

    /**
     * @description WorkSpaceの表示名
     *              WorkSpace display name
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$workSpace.name;
    }
    set name (name: string)
    {
        // データ更新
        externalWorkSpaceUpdateNameUseCase(this._$workSpace, name);
    }

    /**
     * @description 現在、起動中のMovieClipのタイムラインAPIオブジェクトを返却
     *              Returns the timeline API object of the currently running MovieClip
     *
     * @return {ExternalTimeline}
     * @method
     * @public
     */
    getCurrentTimeline (): ExternalTimeline
    {
        return new ExternalTimeline(
            new ExternalMovieClip($getCurrentWorkSpace().scene),
            this
        );
    }
}