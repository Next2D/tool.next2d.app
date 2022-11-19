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
        let matrix = [1, 0, 0, 1, 0, 0];
        for (let idx = 0; this._$matrix.length > idx; ++idx) {
            matrix = Util.$multiplicationMatrix(this._$matrix[idx], matrix);
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
    }

    /**
     * @description リスト表示の再読み込み
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    reload (library_id)
    {
        const scenes = document
            .getElementById("scene-name-menu-list");

        while (scenes.children.length) {
            scenes.children[0].remove();
        }

        // 値を初期化
        this.clear();

        // シーン名をリストに追加
        Util
            .$currentWorkSpace()
            .root
            .addSceneName();

        // シーン移動
        Util.$sceneChange.execute(library_id);
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
