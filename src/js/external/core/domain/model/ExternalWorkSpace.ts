import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
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
     * @description 指定したWorkSpaceの識別ID
     *              Identification ID of the specified WorkSpace
     *
     * @return {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$workSpace.id;
    }

    /**
     * @description WorkSpaceのアクティブ状態を返却
     *              Returns the active state of WorkSpace
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get active (): boolean
    {
        return this._$workSpace.active;
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
            new ExternalMovieClip(this._$workSpace, this._$workSpace.scene),
            this
        );
    }

    /**
     * @description ライブラリAPIオブジェクトを返却
     *              Return library API object
     *
     * @return {ExternalTimeline}
     * @method
     * @public
     */
    getLibrary (): ExternalLibrary
    {
        return new ExternalLibrary(this);
    }
}