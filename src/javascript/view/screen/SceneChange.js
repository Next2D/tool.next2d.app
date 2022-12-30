/**
 * @class
 * @extends {BaseScreen}
 * @memberOf view.screen
 */
class SceneChange extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$length = 0;

        /**
         * @type {array}
         * @private
         */
        this._$matrix = [];

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetY = 0;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$cache = null;
    }

    /**
     * @description 現在のデータをキャッシュ
     *
     * @return {void}
     * @method
     * @public
     */
    cache ()
    {
        // シーンの階層データを保持
        const element = document
            .getElementById("scene-name-menu-list");

        if (element && element.children.length) {

            const children = Array.from(element.children);

            this._$cache = {
                "children": children,
                "length": this._$length,
                "matrix": this._$matrix.slice(),
                "offsetX": this._$offsetX,
                "offsetY": this._$offsetY
            };

        }
    }

    /**
     * @description キャッシュデータから復元
     *
     * @return {void}
     * @method
     * @public
     */
    restore ()
    {
        if (!this._$cache) {
            return ;
        }

        const element = document
            .getElementById("scene-name-menu-list");

        if (!element) {
            return ;
        }

        this._$length  = this._$cache.length;
        this._$matrix  = this._$cache.matrix;
        this._$offsetX = this._$cache.offsetX;
        this._$offsetY = this._$cache.offsetY;

        const children = this._$cache.children;
        for (let idx = 0; children.length > idx; ++idx) {
            element.appendChild(children[idx]);
        }
    }

    /**
     * @description 親のmatrix
     *
     * @member   {array}
     * @method
     * @public
     */
    get matrix ()
    {
        return this._$matrix;
    }

    /**
     * @description 親オブジェクトの結合された変換マトリックス
     *
     * @return {Float32Array}
     * @readonly
     * @method
     * @public
     */
    get concatenatedMatrix ()
    {
        let matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        for (let idx = 0; this._$matrix.length > idx; ++idx) {
            matrix = Util.$multiplicationMatrix(
                matrix,
                this._$matrix[idx]
            );
        }
        return matrix;
    }

    /**
     * @description 親の座標に合わせるx座標
     *
     * @member {number}
     * @method
     * @public
     */
    get offsetX ()
    {
        return this._$offsetX;
    }
    set offsetX (offset_x)
    {
        this._$offsetX = offset_x;
    }

    /**
     * @description 親の座標に合わせるy座標
     *
     * @member {number}
     * @method
     * @public
     */
    get offsetY ()
    {
        return this._$offsetY;
    }
    set offsetY (offset_y)
    {
        this._$offsetY = offset_y;
    }

    /**
     * @description メニューの配列数を返す
     *
     * @member   {number}
     * @method
     * @public
     */
    get length ()
    {
        return this._$length;
    }
    set length (length)
    {
        this._$length = length;
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();
    }

    /**
     * @description パラメーターを初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$offsetX       = 0;
        this._$offsetY       = 0;
        this._$matrix.length = 0;
        this._$length        = 0;
        Util.$activeCharacterIds.length = 0;
    }

    /**
     * @description リスト表示の再読み込み
     *
     * @param  {number} [library_id=-1]
     * @return {void}
     * @method
     * @public
     */
    reload (library_id = -1)
    {
        // キャッシュデータがある時は初期化してスキップ
        if (this._$cache) {
            this._$cache = null;
            return;
        }

        const element = document
            .getElementById("scene-name-menu-list");

        if (!element) {
            return ;
        }

        while (element.children.length) {
            element.children[0].remove();
        }

        // 値を初期化
        this.clear();

        // シーン名をリストに追加
        Util
            .$currentWorkSpace()
            .root
            .addSceneName();

        // シーン移動
        if (library_id > -1) {
            Util.$sceneChange.execute(library_id);
        }
    }

    /**
     * @description 指定のMovieClipを表示
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    execute (library_id)
    {
        // 現在のプロジェクト
        const workSpace = Util.$currentWorkSpace();

        // ライブラリから指定のMovieClipを取得
        const scene = workSpace.getLibrary(library_id);
        const frame = scene.currentFrame;

        // 指定のMovieClipのフレーム
        Util.$timelineFrame.currentFrame = frame;

        // タイムラインのマーカーを移動
        Util.$timelineMarker.move();

        // 上部のタイムラインの位置を補正
        const base = document
            .getElementById("timeline-controller-base");

        // 表示画面の中心
        const moveX = (frame - 1) * (Util.$timelineTool.timelineWidth + 1);
        if (moveX > base.offsetWidth / 2) {
            Util
                .$timelineLayer
                .moveTimeLine(moveX - base.offsetWidth / 2);
        }

        // シーンの入れ替え
        workSpace.scene = scene;
    }
}

Util.$sceneChange = new SceneChange();
