/**
 * @class
 * @memberOf external
 */
class ExternalFrame
{
    /**
     * @param {number} frame
     * @param {number} key_frame
     * @param {ExternalLayer} parent
     * @constructor
     * @public
     */
    constructor (frame, key_frame, parent)
    {
        /**
         * @type {number}
         * @private
         */
        this._$frame = frame;

        /**
         * @type {number}
         * @private
         */
        this._$startFrame = key_frame;

        /**
         * @type {ExternalLayer}
         * @private
         */
        this._$parent = parent;
    }

    /**
     * @member {string}
     * @public
     */
    get name ()
    {
        const labelMap = this._$parent._$layer._$labels;
        return labelMap.has(this._$frame)
            ? labelMap.get(this._$frame)
            : "";
    }
    set name (name)
    {
        const labelMap = this._$parent._$layer._$labels;
        labelMap.set(this._$frame, name);
    }

    /**
     * @member {string}
     * @public
     */
    get actionScript ()
    {
        const actionMap = this._$parent._$layer._$actions;
        return actionMap.has(this._$frame)
            ? actionMap.get(this._$frame)
            : "";
    }
    set actionScript (script)
    {
        const actionMap = this._$parent._$layer._$actions;
        actionMap.set(this._$frame, script);
    }

    /**
     * @return {number}
     * @public
     */
    get startFrame ()
    {
        return this._$startFrame;
    }

    /**
     * @member {ExternalSoundItem[]}
     * @public
     */
    get soundLibraryItems ()
    {
        const soundMap = this._$parent._$layer._$sounds;
        if (!soundMap.size || !soundMap.has(this._$frame)) {
            return [];
        }

        const sounds = soundMap.get(this._$frame);

        const externalDocument = this
            ._$parent
            ._$parent
            ._$document;

        const externalSoundItems = [];

        for (let idx = 0; idx < sounds.length; ++idx) {

            const soundObject = sounds[idx];
            const instance = externalDocument
                ._$workSpace
                .getLibrary(
                    soundObject.characterId
                );

            const externalSoundItem = new ExternalSoundItem(
                instance, externalDocument
            );

            if (soundObject.loopCount) {
                externalSoundItem.soundLoopMode = "loop";
            }

            externalSoundItems.push(externalSoundItem);
        }

        return externalSoundItems;
    }

    /**
     * @return {array}
     * @public
     */
    get elements ()
    {
        const characters = this
            ._$parent
            ._$layer
            .getActiveCharacter(this._$frame);

        const elements = [];
        for (let idx = 0; idx < characters.length; ++idx) {
            elements.push(new ExternalElement(
                characters[idx], this
            ));
        }

        return elements;
    }
}
