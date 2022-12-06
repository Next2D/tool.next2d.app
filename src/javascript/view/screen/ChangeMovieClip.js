/**
 * @class
 * @memberOf view.screen
 */
class ChangeMovieClip extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();
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

        const elementIds = [];
    }

    execute ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        this.save();

        const workSpace = Util.$currentWorkSpace();

        const scene = workSpace.scene;
        const frame = Util.$timelineFrame.currentFrame;

        const id = workSpace.nextLibraryId;

        const instance = workSpace.addLibrary(
            Util
                .$libraryController
                .createInstance(
                    InstanceType.MOVIE_CLIP, `MovieClip_${id}`, id
                )
        );

        // MovieClipに指定したDisplayObjectを登録
        const newLayer = new Layer();
        instance.setLayer(0, newLayer);

        const x = +document.getElementById("object-x").value;
        const y = +document.getElementById("object-y").value;
        const w = +document.getElementById("object-width").value;
        const h = +document.getElementById("object-height").value;

        const dx = x + w / 2;
        const dy = y + h / 2;

        const layers = new Map();
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];
            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const range = character.getRange(frame);
            if (!layers.has(layer.id)) {
                layers.set(layer.id, {
                    "layer": layer,
                    "range": range
                });
            }

            const cloneCharacter = new Character();
            cloneCharacter.libraryId = character.libraryId;

            const place = character.getPlace(range.startFrame);

            const clonePlace = {
                "frame": 1,
                "matrix": place.matrix.slice(),
                "colorTransform": place.colorTransform.slice(),
                "blendMode": place.blendMode,
                "filter": place.filter.slice(),
                "loop": Util.$getDefaultLoopConfig(),
                "depth": newLayer._$characters.length
            };

            if (place.loop) {
                clonePlace.loop = place.loop;
            }

            cloneCharacter.setPlace(1, clonePlace);

            cloneCharacter.x -= dx;
            cloneCharacter.y -= dy;

            newLayer.addCharacter(cloneCharacter);

            // 削除
            character.remove(layer);
        }

        // 各レイヤーを再描画
        for (const object of layers.values()) {

            const layer = object.layer;
            const range = object.range;

            const characters = layer.getActiveCharacter(range.startFrame);
            if (characters.length) {

                // 深度順に並び替え
                layer.sort(characters, frame);

                for (let idx = 0; idx < characters.length; ++idx) {
                    characters[idx].getPlace(frame).depth = idx;
                }

            } else {

                layer.addEmptyCharacter(
                    new EmptyCharacter({
                        "startFrame": range.startFrame,
                        "endFrame": range.endFrame
                    })
                );

            }

            layer.reloadStyle();
        }

        // 選択中のelementを初期化
        tool.clearActiveElement();

        const character = new Character();
        character.libraryId = instance.id;
        character.endFrame  = frame + 1;

        character.setPlace(frame, {
            "frame": frame,
            "matrix": [1, 0, 0, 1, dx / Util.$zoomScale, dy / Util.$zoomScale],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "loop": Util.$getDefaultLoopConfig()
        });

        const layer = new Layer();
        layer.addCharacter(character);
        scene.addLayer(layer);

        // 前方に空のキーフレームを追加
        if (frame > 1) {
            layer.addEmptyCharacter(new EmptyCharacter({
                "startFrame": 1,
                "endFrame": frame
            }));
        }

        layer.reloadStyle();

        // 再描画
        this.reloadScreen();

        // 初期化
        this._$saved = false;
    }
}