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
import { execute as workSpaceLoadLibraryService } from "@/core/application/WorkSpace/service/WorkSpaceLoadLibraryService";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { $VERSION } from "@/config/Config";
import { $CONTROLLER_DEFAULT_WIDTH_SIZE } from "@/config/ControllerConfig";
import { $clamp } from "@/global/GlobalUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
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
let $workSpaceId: number = 1;

/**
 * @description 各エリアの状態管理を行うクラス
 *              Class to manage the status of each area
 * @class
 * @public
 */
export class WorkSpace
{
    private _$id: number;
    private _$name: string;
    private _$scene: MovieClip;
    private _$active: boolean;
    private readonly _$root: MovieClip;
    private readonly _$stage: Stage;
    private readonly _$libraries: Map<number, InstanceImpl<any>>;
    private readonly _$pathMap: Map<string, number>;
    private readonly _$symbolMap: Map<string, number>;
    private readonly _$screenTab: ScreenTab;
    private readonly _$toolAreaState: UserToolAreaStateObjectImpl;
    private readonly _$timelineAreaState: UserTimelineAreaStateObjectImpl;
    private readonly _$propertyAreaState: UserPropertyAreaStateObjectImpl;
    private readonly _$controllerAreaState: UserControllerAreaStateObjectImpl;
    private readonly _$plugins: Map<any, any>;
    private readonly _$externalTimeline: ExternalTimeline;

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
        this._$id = $workSpaceId++;

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
         * @type {Map}
         * @private
         */
        this._$pathMap = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$symbolMap = new Map();

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

        // root情報をセット
        externalWorkSpaceRegisterInstanceService(this, this._$root);

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

        /**
         * @type {ExternalTimeline}
         * @private
         */
        this._$externalTimeline = new ExternalTimeline(this, this._$root);

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
    }

    /**
     * @description WorkSpaceの管理ID
     *              WorkSpace administrative ID
     *
     * @member {number}
     * @static
     */
    static get workSpaceId (): number
    {
        return $workSpaceId;
    }
    static set workSpaceId (id: number)
    {
        $workSpaceId = $clamp(id, 1, Number.MAX_VALUE);
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
     * @description ライブラリのアイテム情報を全て返却
     *              Return all item information in the library
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get libraries ():  Map<number, InstanceImpl<any>>
    {
        return this._$libraries;
    }

    /**
     * @description ライブラリ名とIDのマッピング情報を返却
     *              Return library name and ID mapping information
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get pathMap (): Map<string, number>
    {
        return this._$pathMap;
    }

    /**
     * @description シンボル名とIDのマッピング情報を返却
     *              Symbol name and ID mapping information returned
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get symbolMap (): Map<string, number>
    {
        return this._$symbolMap;
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
     * @description タイムラインのAPIを返却
     *              Launch Timeline API
     *
     * @return {ExternalTimeline}
     * @method
     * @public
     */
    getExternalTimeline (): ExternalTimeline
    {
        return this._$externalTimeline;
    }

    /**
     * @description 既存のシーン(MovieClip)を終了して、指定のシーン(MovieClip)を起動する
     *              Exit an existing scene (MovieClip) and start the specified scene (MovieClip)
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

        return this
            ._$externalTimeline
            .editMovieClip(movie_clip);
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
     * @param  {object} object
     * @param  {boolean} [share=false]
     * @return {void}
     * @method
     * @public
     */
    load (object: WorkSpaceSaveObjectImpl, share: boolean = false): void
    {
        this.name = object.name;

        if (share && object.id) {
            this._$id = object.id;
        }

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
     * @description ライブラリに登録されたアイテムを指定IDで取得
     *              Obtain items registered in the library with a specified ID
     *
     * @param {number} library_id
     * @return {void}
     * @method
     * @public
     */
    getLibrary (library_id: number): InstanceImpl<any> | null
    {
        return this._$libraries.has(library_id)
            ? this._$libraries.get(library_id) as NonNullable<InstanceImpl<any>>
            : null;
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
        // セーブデータからライブラリを複製
        workSpaceLoadLibraryService(this, libraries);

        // 名前とIDのマッピングを生成
        workSpaceCreatePathMapService(this);
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
        Object.assign(this._$toolAreaState, object);
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
        Object.assign(this._$propertyAreaState, object);
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
        Object.assign(this._$timelineAreaState, object);
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
        Object.assign(this._$controllerAreaState, object);
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
            "id": this.id,
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