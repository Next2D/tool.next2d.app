/**
 * @class
 */
class Frame
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor (object = null)
    {
        this._$layerId = 0;
        this._$classes = new Map();

        if (object) {
            this.classes = object.classes;
        }
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        for (let [frame, css] of this._$classes) {

            const element = document
                .getElementById(`${this._$layerId}-${frame}`);

            Util.$timeline.removeFrameClass(element);

            const classList = element.classList;
            for (let idx = 0; idx < css.length; ++idx) {
                classList.add(css[idx]);
            }

            element.dataset.frameState = css[0];
        }
    }

    /**
     * @return {array}
     * @public
     */
    get classes ()
    {
        const classes = [];
        for (let [frame, css] of this._$classes) {
            classes.push({
                "frame": frame,
                "classes": css
            });
        }
        return classes;
    }

    /**
     * @param  {array} classes
     * @return {void}
     * @public
     */
    set classes (classes)
    {
        for (let idx = 0; idx < classes.length; ++idx) {
            const object = classes[idx];
            this._$classes.set(object.frame | 0, object.classes);
        }
    }

    /**
     * @param  {number} frame
     * @return {boolean}
     * @public
     */
    hasClasses (frame)
    {
        return this._$classes.has(frame | 0);
    }

    /**
     * @param  {number} frame
     * @return {array}
     * @public
     */
    getClasses (frame)
    {
        return this._$classes.get(frame | 0);
    }

    /**
     * @param  {number} frame
     * @param  {array}  css
     * @return {void}
     * @public
     */
    setClasses (frame, css)
    {
        this._$classes.set(frame | 0, css);
    }

    /**
     * @param  {number} frame
     * @return {void}
     * @public
     */
    deleteClasses (frame)
    {
        this._$classes.delete(frame | 0);
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return { "classes": this.classes };
    }
}
