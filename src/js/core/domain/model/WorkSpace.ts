import type { InstanceImpl } from "../../../interface/InstanceImpl";
import { MovieClip } from "./MovieClip";
import { Stage } from "./Stage";

/**
 * @description 各エリアの状態管理を行うクラス
 *              Class to manage the status of each area
 * @class
 * @public
 */
export class WorkSpace
{
    private _$name: string;
    // private _$scene: MovieClip | null;
    private _$stage: Stage;
    private _$libraries: Map<number, InstanceImpl<any>>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";

        // /**
        //  * @type {MovieClip}
        //  * @default null
        //  * @private
        //  */
        // this._$scene = null;

        /**
         * @type {Stage}
         * @default null
         * @private
         */
        this._$stage = new Stage();

        /**
         * @type {Map}
         * @private
         */
        this._$libraries = new Map();

        // /**
        //  * @type {Map}
        //  * @private
        //  */
        // this._$nameMap = new Map();

        // /**
        //  * @type {Map}
        //  * @private
        //  */
        // this._$plugins = new Map();

        // this._$position = 0;
        // this._$ruler = false;
        // this._$rulerX = [];
        // this._$rulerY = [];
        // this._$characterId = 0;
        // this._$revision = [];
        // this._$currentData = null;
        // this._$currentFrame = 0;
    }

    /**
     * @description プロジェクト名を返す
     *              Return project name
     *
     * @member {string} name
     * @return {string}
     * @public
     */
    get name (): string
    {
        return this._$name;
    }
    set name (name: string)
    {
        this._$name = `${name}`;
    }

    /**
     * @description rootのMovieClipを返す
     *              Returns the root MovieClip
     *
     * @return {MovieClip}
     * @readonly
     * @public
     */
    get root (): MovieClip
    {
        return this._$libraries.get(0);
    }

    /**
     * @description プロジェクトのStageオブジェクトを返す
     *              Returns the Stage object of the project
     *
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage (): Stage
    {
        return this._$stage;
    }

    // /**
    //  * @description 指定のシーン(MovieClip)を起動する
    //  *
    //  * @param  {MovieClip} scene
    //  * @return {Promise}
    //  * @public
    //  */
    // setScene (scene: MovieClip): Promise<void>
    // {
    //     if (this._$scene) {
    //         this._$scene.stop();
    //     }

    //     this._$scene = scene;
    //     return scene.run();
    // }

    /**
     * @description ワークスペースを起動
     *              Start workspace
     *
     * @return {void}
     * @method
     * @public
     */
    run (): void
    {
        // TODO
        this._$stage.run();
    }
}