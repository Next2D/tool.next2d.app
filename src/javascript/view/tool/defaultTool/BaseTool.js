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
     * @instance
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
     * @return {void}
     * @method
     * @public
     */
    attachLayer ()
    {
        if (Util.$timeline._$targetLayer) {
            return ;
        }

        const parent = document
            .getElementById("timeline-content");

        if (!parent.children.length) {
            return ;
        }

        const node = parent.children[0];
        const layerElement = document
            .getElementById(`${node.dataset.layerId}-1`);

        if (!layerElement) {
            return ;
        }

        Util.$timeline._$targetLayer = layerElement;
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
        const target  = Util.$timeline._$targetLayer;
        const layerId = target.dataset.layerId | 0;

        const layer = scene.getLayer(layerId | 0);
        if (layer.lock) {
            return ;
        }

        Util
            .$controller
            .createContainer("shape", object.name, object.id);

        const workSpace = Util.$currentWorkSpace();
        const shape = workSpace.addLibrary(object);

        const frame = Util.$timelineFrame.currentFrame;

        const frameElement = document
            .getElementById(`${layerId}-${frame}`); // fixed

        // add frame
        Util
            .$timeline
            .dropKeyFrame(frameElement);

        // pointer
        const character = new Character();
        character.libraryId  = shape.id;
        character.startFrame = frame;
        character.endFrame   = layer.getEndFrame(frame + 1);
        character.setPlace(frame, {
            "frame": frame,
            "matrix": [1, 0, 0, 1, x, y],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": layer._$characters.length
        });

        // added
        layer.addCharacter(character);
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
        const target  = Util.$timeline._$targetLayer;
        const layerId = target.dataset.layerId | 0;

        const layer = scene.getLayer(layerId | 0);
        if (layer.lock) {
            return ;
        }

        Util
            .$controller
            .createContainer("text", object.name, object.id);

        const workSpace = Util.$currentWorkSpace();
        const textField = workSpace.addLibrary(object);

        const frame = Util.$timelineFrame.currentFrame;

        const frameElement = document
            .getElementById(`${layerId}-${frame}`); // fixed

        // add frame
        Util
            .$timeline
            .dropKeyFrame(frameElement);

        // pointer
        const character = new Character();
        character.libraryId  = textField.id;
        character.startFrame = frame;
        character.endFrame   = layer.getEndFrame(frame + 1);
        character.setPlace(frame, {
            "frame": frame,
            "matrix": [1, 0, 0, 1, x, y],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": layer._$characters.length
        });

        // added
        layer.addCharacter(character);
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
