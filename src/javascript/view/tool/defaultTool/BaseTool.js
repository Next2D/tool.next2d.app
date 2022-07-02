/**
 * @class
 */
class BaseTool extends Tool
{
    /**
     * @description ツールのElementを管理するクラス
     *
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name)
    {
        super(name);
        this.initialize();
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @interface
     */
    initialize () {}

    /**
     * @param {boolean} [active=true]
     * @method
     * @public
     */
    changeNodeEvent (active = true)
    {
        Util.$hitColor = null;

        const stageArea = document.getElementById("stage-area");
        if (stageArea) {
            const children = stageArea.children;
            for (let idx = 0; idx < children.length; ++idx) {

                const node = children[idx];
                if (node.dataset.shapePointer) {
                    node.remove();
                    --idx;
                    continue;
                }

                if (!node.dataset.child) {
                    continue;
                }

                node.style.pointerEvents = active ? "auto" : "none";

            }
        }
    }

    /**
     * @param  {object} object
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    createShape (object, x = 0, y = 0)
    {
        const scene   = Util.$currentWorkSpace().scene;
        const target  = Util.$timelineLayer.targetLayer;
        const layerId = target.dataset.layerId | 0;

        // ロック中のレイヤーの場合は何もしない
        const layer = scene.getLayer(layerId | 0);
        if (layer.lock) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const shape = workSpace.addLibrary(object);

        const frame = Util.$timelineFrame.currentFrame;

        // 挿入位置を取得
        const location = layer.adjustmentLocation(frame);

        // pointer
        const character = new Character();
        character.libraryId  = shape.id;
        character.startFrame = location.startFrame;
        character.endFrame   = location.endFrame;
        character.setPlace(location.startFrame, {
            "frame": location.startFrame,
            "matrix": [1, 0, 0, 1, x, y],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": layer._$characters.length
        });

        // Shapeをレイヤーに追加して再描画
        layer.addCharacter(character);

        // タイムラインを再描画
        layer.reloadStyle();

        // ライブラリを再描画
        Util.$libraryController.reload();
    }

    /**
     * @param  {object} object
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @public
     */
    createTextField (object, x = 0, y = 0)
    {
        const scene   = Util.$currentWorkSpace().scene;
        const target  = Util.$timelineLayer.targetLayer;
        const layerId = target.dataset.layerId | 0;

        const layer = scene.getLayer(layerId | 0);
        if (layer.lock) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const textField = workSpace.addLibrary(object);

        const frame = Util.$timelineFrame.currentFrame;

        // 挿入位置を取得
        const location = layer.adjustmentLocation(frame);

        // pointer
        const character = new Character();
        character.libraryId  = textField.id;
        character.startFrame = location.startFrame;
        character.endFrame   = location.endFrame;
        character.setPlace(location.startFrame, {
            "frame": location.startFrame,
            "matrix": [1, 0, 0, 1, x, y],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": layer._$characters.length
        });

        // レイヤーに追加
        layer.addCharacter(character);

        // タイムラインを再描画
        layer.reloadStyle();

        // ライブラリを再描画
        Util.$libraryController.reload();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reloadScreen ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        Util
            .$currentWorkSpace()
            .scene
            .changeFrame(frame);
    }
}
