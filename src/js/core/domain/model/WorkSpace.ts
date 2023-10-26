import { $PROGRESS_MENU_NAME } from "../../../config/MenuConfig";
import type { InstanceImpl } from "../../../interface/InstanceImpl";
import type { MenuImpl } from "../../../interface/MenuImpl";
import { $getMenu } from "../../../menu/application/MenuUtil";
import type { ProgressMenu } from "../../../menu/domain/model/ProgressMenu";
import { ScreenTab } from "../../../screen/domain/model/ScreenTab";
import { MovieClip } from "./MovieClip";
import { Stage } from "./Stage";
import { execute as progressMenuHideService } from "../../../menu/application/ProgressMenu/service/ProgressMenuHideService";

/**
 * @description プロジェクトのユニークID
 *              Project Unique ID
 *
 * @type {number}
 * @private
 */
let workSpaceId: number = 1;

/**
 * @description 各エリアの状態管理を行うクラス
 *              Class to manage the status of each area
 * @class
 * @public
 */
export class WorkSpace
{
    private _$name: string;
    private _$scene: MovieClip;
    private readonly _$root: MovieClip;
    private readonly _$stage: Stage;
    private readonly _$libraries: Map<number, InstanceImpl<any>>;
    private readonly _$sceneTab: ScreenTab;
    private readonly _$id: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @private
         */
        this._$id = workSpaceId++;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = `Untitled-${this._$id}`;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$root = new MovieClip();

        /**
         * @type {MovieClip}
         * @private
         */
        this._$scene = this._$root;

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = new Stage();

        /**
         * @type {Map}
         * @private
         */
        this._$libraries = new Map();

        /**
         * @type {ScreenTab}
         * @private
         */
        this._$sceneTab = new ScreenTab(this);

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
     * @description プロジェクトのユニークIDを返却
     *              Return the unique ID of the project
     *
     * @return {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$id;
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

    /**
     * @description 指定のシーン(MovieClip)を起動する
     *              Launch the specified scene (MovieClip)
     *
     * @param  {MovieClip} movie_clip
     * @return {Promise}
     * @method
     * @public
     */
    setScene (movie_clip: MovieClip): Promise<void>
    {
        // 現在のMovieClipを終了
        this._$scene.stop();

        // 指定のMovieClipを起動
        this._$scene = movie_clip;
        return movie_clip.run();
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    initialize ():  Promise<void>
    {
        return new Promise((resolve) =>
        {
            this._$sceneTab.initialize();
            return resolve();
        });
    }

    /**
     * @description ワークスペースを停止して、全てを初期化
     *              Stop workspace and initialize everything
     *
     * @return {Promise}
     * @method
     * @public
     */
    stop (): Promise<void>
    {
        return new Promise((reslove) =>
        {
            return reslove();
        });
    }

    /**
     * @description ワークスペースを起動
     *              Start workspace
     *
     * @return {Promise}
     * @method
     * @public
     */
    run (): Promise<void>
    {
        return new Promise((reslove): void =>
        {
            // Stageを起動
            this._$stage.run();

            // タブをアクティブに設定
            this._$sceneTab.active();

            // rootのMovieClipを起動
            this
                ._$scene
                .run()
                .then(() =>
                {
                    // 進行状況メニューを非表示に
                    progressMenuHideService();

                    // 終了
                    reslove();
                });
        });
    }
}