import type { InstanceImpl } from "../../../../interface/InstanceImpl";
import { ScreenTab } from "../../../../screen/domain/model/ScreenTab";
import { MovieClip } from "./MovieClip";
import { Stage } from "./Stage";
import { execute as workSpaceRunUseCase } from "../../application/WorkSpace/usecase/WorkSpaceRunUseCase";
import { execute as workSpaceStopUseCase } from "../../application/WorkSpace/usecase/WorkSpaceStopUseCase";
import { execute as workSpaceInitializeUseCase } from "../../application/WorkSpace/usecase/WorkSpaceInitializeUseCase";
import { execute as workSpaceRemoveUseCase } from "../../application/WorkSpace/usecase/WorkSpaceRemoveUseCase";

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
    private _$active: boolean;
    private readonly _$root: MovieClip;
    private readonly _$stage: Stage;
    private readonly _$libraries: Map<number, InstanceImpl<any>>;
    private readonly _$screenTab: ScreenTab;
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
         * @type {Map}
         * @private
         */
        this._$libraries = new Map();

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = new Stage();

        /**
         * @type {MovieClip}
         * @private
         */
        this._$root = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "main",
            "symbol": ""
        });
        this._$libraries.set(0, this._$root);

        /**
         * @type {MovieClip}
         * @private
         */
        this._$scene = this._$root;

        /**
         * @type {ScreenTab}
         * @private
         */
        this._$screenTab = new ScreenTab(this);

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

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
     * @description プロジェクトの起動状態を返却
     *              Project startup status returned
     *
     * @return {boolean}
     * @readonly
     * @public
     */
    get active (): boolean
    {
        return this._$active;
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
        return this._$root;
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
     * @description 選択中のMovieClipを返却
     *              Return the selected MovieClip
     *
     * @return {MovieClip}
     * @readonly
     * @public
     */
    get scene (): MovieClip
    {
        return this._$scene;
    }

    /**
     * @description プロジェクトのタブオブジェクトを返す
     *              Returns the tab object of the project
     *
     * @return {Stage}
     * @readonly
     * @public
     */
    get screenTab (): ScreenTab
    {
        return this._$screenTab;
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
    initialize (): Promise<void>
    {
        return workSpaceInitializeUseCase(this);
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
        // 状態を終了状態に更新
        this._$active = false;

        // 終了処理を実行
        return workSpaceStopUseCase(this);
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
        // 状態を起動状態に更新
        this._$active = true;

        // 起動処理を実行
        return workSpaceRunUseCase(this);
    }

    /**
     * @description ワークスペースの削除処理
     *              Workspace deletion process
     *
     * @return {Promise}
     * @method
     * @public
     */
    remove (): Promise<void>
    {
        // 削除処理を実行
        return workSpaceRemoveUseCase(this);
    }
}