import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalItem } from "./ExternalItem";
import { ExternalLayer } from "./ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as externalMovieClipUpdateScriptUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateScriptUseCase";

/**
 * @description MovieClipの外部APIクラス
 *              MovieClip external API classes
 * @class
 */
export class ExternalMovieClip extends ExternalItem
{
    private readonly _$movieClip: MovieClip;
    private readonly _$workSpace: WorkSpace;
    private readonly _$externalTimeline: ExternalTimeline;

    /**
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip
    ) {

        super(movie_clip);

        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;

        /**
         * @type {ExternalTimeline}
         * @private
         */
        this._$externalTimeline = new ExternalTimeline(work_space, movie_clip);
    }

    /**
     * @description 指定したMovieClipの識別ID
     *              Identification ID of the specified MovieClip
     *
     * @return {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$movieClip.id;
    }

    /**
     * @description MovieClipのアクティブ状態を返却
     *              Returns the active state of MovieClip
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get active (): boolean
    {
        return this._$movieClip.active;
    }

    /**
     * @description MovieClip固有のタイムラインを返却
     *              Returns a MovieClip-specific timeline
     *
     * @member {ExternalTimeline}
     * @readonly
     * @public
     */
    get timeline (): ExternalTimeline
    {
        return this._$externalTimeline;
    }

    /**
     * @description MovieClipのフレーム情報を更新
     *              Update MovieClip frame information
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentFrame (): number
    {
        return this._$movieClip.currentFrame;
    }
    set currentFrame (frame: number)
    {
        this._$movieClip.currentFrame = frame;
    }

    /**
     * @description MovieClipの全てのレイヤーを配列で返却
     *              Return all layers in MovieClip as an array
     *
     * @member {ExternalLayer[]}
     * @readonly
     * @public
     */
    get layers (): ExternalLayer[]
    {
        const layers = this._$movieClip.layers;

        const externalLayers = [];
        for (let idx = 0; idx < layers.length; ++idx) {
            externalLayers.push(new ExternalLayer(
                this._$workSpace,
                this._$movieClip,
                layers[idx]
            ));
        }

        return externalLayers;
    }

    /**
     * @description 指定フレームのスクリプトを返却
     *              Returns the script for the specified frame
     *
     * @param  {number} frame
     * @return {string}
     * @method
     * @public
     */
    getAction (frame: number): string
    {
        return this._$movieClip.getAction(frame);
    }

    /**
     * @description 指定フレームのスクリプトを更新、空のスクリプト指定で削除
     *              Update scripts in specified frame, delete with empty script specification
     *
     * @param  {number} frame
     * @param  {string} [script = ""]
     * @return {void}
     * @method
     * @public
     */
    setAction (frame: number, script: string = ""): void
    {
        externalMovieClipUpdateScriptUseCase(
            this._$workSpace, this._$movieClip, frame, script
        );
    }
}