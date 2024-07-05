import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalMovieClip } from "./ExternalMovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as externalWorkSpaceUpdateNameUseCase } from "@/external/core/application/ExternalWorkSpace/usecase/ExternalWorkSpaceUpdateNameUseCase";
import { ExternalSoundArea } from "@/external/controller/domain/model/ExternalSoundArea";
import { ExternalStage } from "./ExternalStage";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";

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
     * @description WorkSpaceのStageを返却
     *              Returns the Stage of WorkSpace
     *
     * @member {ExternalStage}
     * @readonly
     * @public
     */
    get stage (): ExternalStage
    {
        return new ExternalStage(this._$workSpace);
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
    getTimeline (): ExternalTimeline
    {
        return new ExternalTimeline(
            this._$workSpace,
            this._$workSpace.scene
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
        return new ExternalLibrary(this._$workSpace);
    }

    /**
     * @description サウンドエリアAPIオブジェクトを返却
     *              Return sound area API object
     *
     * @return {ExternalSoundArea}
     * @method
     * @public
     */
    getSoundArea (): ExternalSoundArea
    {
        return new ExternalSoundArea(this._$workSpace, this._$workSpace.scene);
    }

    /**
     * @description 現在、起動中のMovieClipのタイムラインAPIオブジェクトを返却
     *              Returns the timeline API object of the currently running MovieClip
     *
     * @return {ExternalScreen}
     * @method
     * @public
     */
    getScreen (): ExternalScreen
    {
        return new ExternalScreen(
            this._$workSpace,
            this._$workSpace.scene
        );
    }
}