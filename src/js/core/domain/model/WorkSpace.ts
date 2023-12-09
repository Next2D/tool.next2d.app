import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { UserToolAreaStateObjectImpl } from "@/interface/UserToolAreaStateObjectImpl";
import type { UserTimelineAreaStateObjectImpl } from "@/interface/UserTimelineAreaStateObjectImpl";
import type { UserPropertyAreaStateObjectImpl } from "@/interface/UserPropertyAreaStateObjectImpl";
import type { WorkSpaceSaveObjectImpl } from "@/interface/WorkSpaceSaveObjectImpl";
import type { UserControllerAreaStateObjectImpl } from "@/interface/UserControllerAreaStateObjectImpl";
import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import { ScreenTab } from "@/screen/domain/model/ScreenTab";
import { MovieClip } from "./MovieClip";
import { Stage } from "./Stage";
import { execute as workSpaceRunUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceRunUseCase";
import { execute as workSpaceStopUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceStopUseCase";
import { execute as workSpaceInitializeUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceInitializeUseCase";
import { execute as workSpaceRemoveUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceRemoveUseCase";
import { $VERSION } from "@/config/Config";
import { $CONTROLLER_DEFAULT_WIDTH_SIZE } from "@/config/ControllerConfig";
import {
    $TIMELINE_DEFAULT_HEIGHT_SIZE,
    $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE,
    $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE
} from "@/config/TimelineConfig";

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
    private readonly _$toolAreaState: UserToolAreaStateObjectImpl;
    private readonly _$timelineAreaState: UserTimelineAreaStateObjectImpl;
    private readonly _$propertyAreaState: UserPropertyAreaStateObjectImpl;
    private readonly _$controllerAreaState: UserControllerAreaStateObjectImpl;
    private _$plugins: Map<any, any>;

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

        /**
         * @type {object}
         * @private
         */
        this._$toolAreaState = {
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        };

        /**
         * @type {object}
         * @private
         */
        this._$timelineAreaState = {
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0,
            "width": 0,
            "height": $TIMELINE_DEFAULT_HEIGHT_SIZE,
            "frameWidth": $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE,
            "frameHeight": $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE
        };

        /**
         * @type {object}
         * @private
         */
        this._$propertyAreaState = {
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        };

        /**
         * @type {object}
         * @private
         */
        this._$controllerAreaState = {
            "width": $CONTROLLER_DEFAULT_WIDTH_SIZE
        };

        // /**
        //  * @type {Map}
        //  * @private
        //  */
        // this._$nameMap = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$plugins = new Map();

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
     * @description ツールエリアの移動状況のオブジェクトを返却
     *              Returns tool area movement status objects
     *
     * @return {object}
     * @readonly
     * @public
     */
    get toolAreaState (): UserToolAreaStateObjectImpl
    {
        return this._$toolAreaState;
    }

    /**
     * @description タイムラインエリアの移動状況のオブジェクトを返却
     *              Returns movement status objects in the timeline area
     *
     * @return {object}
     * @readonly
     * @public
     */
    get timelineAreaState (): UserTimelineAreaStateObjectImpl
    {
        return this._$timelineAreaState;
    }

    /**
     * @description コントローラーエリアの状況オブジェクトを返却
     *              Returns controller area status object
     *
     * @return {object}
     * @readonly
     * @public
     */
    get controllerAreaState (): UserControllerAreaStateObjectImpl
    {
        return this._$controllerAreaState;
    }

    /**
     * @description プロパティエリアの移動状況のオブジェクトを返却
     *              Returns an object of the movement status of the property area
     *
     * @return {object}
     * @readonly
     * @public
     */
    get propertyAreaState (): UserPropertyAreaStateObjectImpl
    {
        return this._$propertyAreaState;
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
     * @description ライブラリのユニークIDを生成
     *              Generate unique ID for library
     *
     * @return {number}
     * @readonly
     * @public
     */
    get nextLibraryId (): number
    {
        const keys: number[] = Array.from(this._$libraries.keys());
        keys.sort((a: number, b: number): number =>
        {
            if (a > b) {
                return 1;
            }

            if (a < b) {
                return -1;
            }

            return 0;
        });

        const lastLibraryId: number = this._$libraries.get(keys.pop() || 0).id;
        return lastLibraryId + 1;
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
     * @description セーブデータからWorkSpaceを再構築
     *              Rebuild WorkSpace from saved data
     *
     * @param {object} object
     * @return {void}
     * @method
     * @public
     */
    load (object: WorkSpaceSaveObjectImpl): void
    {
        this.name = object.name;

        // Stageをセット
        this._$stage.load(object.stage);

        if (object.libraries) {
            this.loadLibrary(object.libraries);
        }

        // update tool area
        if (object.tool) {
            this.updateToolArea(object.tool);
        }

        // update timeline area
        if (object.timeline) {
            this.updateTimelineArea(object.timeline);
        }

        // update property area
        if (object.property) {
            this.updatePropertyArea(object.property);
        }

        if (object.controller) {
            this.updateControllerArea(object.controller);
        }
    }

    /**
     * @description セーブデータからライブラリのオブジェクトを複製
     *              Duplicate library objects from save data
     *
     * @param  {array} libraries
     * @return {void}
     * @method
     * @public
     */
    loadLibrary (libraries: InstanceSaveObjectImpl[]): void
    {
        for (let idx: number = 0; idx < libraries.length; ++idx) {

            const libraryObject = libraries[idx];

            // rootの読み込み
            if (libraryObject.id === 0) {
                this._$root.load(libraryObject);
                continue;
            }

            switch (libraryObject.type) {

                case "container":
                    {
                        const movieClip = new MovieClip(libraryObject);
                        this._$libraries.set(movieClip.id, movieClip);
                    }
                    break;

                default:
                    throw new Error("This is an undefined class.");

            }
        }
    }

    /**
     * @description セーブデータからツールエリアの状態を読み込む
     *              Read tool area status from saved data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    updateToolArea (object: UserToolAreaStateObjectImpl): void
    {
        this._$toolAreaState.state      = object.state;
        this._$toolAreaState.offsetLeft = object.offsetLeft;
        this._$toolAreaState.offsetTop  = object.offsetTop;
    }

    /**
     * @description セーブデータからプロパティエリアの状態を読み込む
     *              Read the state of the property area from the saved data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    updatePropertyArea (object: UserPropertyAreaStateObjectImpl): void
    {
        this._$propertyAreaState.state      = object.state;
        this._$propertyAreaState.offsetLeft = object.offsetLeft;
        this._$propertyAreaState.offsetTop  = object.offsetTop;
    }

    /**
     * @description セーブデータからタイムラインエリアの状態を読み込む
     *              Read the state of the timeline area from the saved data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    updateTimelineArea (object: UserTimelineAreaStateObjectImpl): void
    {
        this._$timelineAreaState.state       = object.state;
        this._$timelineAreaState.offsetLeft  = object.offsetLeft;
        this._$timelineAreaState.offsetTop   = object.offsetTop;
        this._$timelineAreaState.width       = object.width;
        this._$timelineAreaState.height      = object.height;
        this._$timelineAreaState.frameWidth  = object.frameWidth;
        this._$timelineAreaState.frameHeight = object.frameHeight;
    }

    /**
     * @description セーブデータからコントローラーエリアの状態を読み込む
     *              Read controller area status from saved data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    updateControllerArea (object: UserControllerAreaStateObjectImpl): void
    {
        this._$controllerAreaState.width  = object.width;
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

    /**
     * @description 今の状態をIndexedDBに保存
     *              Save the current state to IndexedDB.
     *
     * @return {Promise}
     * @method
     * @public
     */
    toObject (): WorkSpaceSaveObjectImpl
    {
        const libraries = [];
        for (const instance of this._$libraries.values()) {
            libraries.push(instance.toObject());
        }

        return {
            "version": $VERSION,
            "name": this.name,
            "stage": this.stage.toObject(),
            "libraries": libraries,
            "plugins": Array.from(this._$plugins.values()),
            "tool": structuredClone(this._$toolAreaState),
            "timeline": structuredClone(this._$timelineAreaState),
            "property": structuredClone(this._$propertyAreaState),
            "controller": structuredClone(this._$controllerAreaState)
        };
    }
}