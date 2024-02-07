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
    private readonly _$externalTimeline: ExternalTimeline;

    /**
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip
    ) {

        super(work_space, movie_clip);

        /**
         * @type {ExternalTimeline}
         * @private
         */
        this._$externalTimeline = new ExternalTimeline(work_space, movie_clip);
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
        return this._$instance.active;
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
        return this._$instance.currentFrame;
    }
    set currentFrame (frame: number)
    {
        this._$instance.currentFrame = frame;
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
        const layers = this._$instance.layers;

        const externalLayers = [];
        for (let idx = 0; idx < layers.length; ++idx) {
            externalLayers.push(new ExternalLayer(
                this._$workSpace,
                this._$instance,
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
        return this._$instance.getAction(frame);
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
            this._$workSpace, this._$instance, frame, script
        );
    }
}