export class TimelineLayer
{
    private readonly _$elements: HTMLElement[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$elements = [];
    }

    /**
     * @description レイヤーコンテンツのElement配列
     *              Element array of layered content
     *
     * @readonly
     * @return {array}
     * @public
     */
    get elements (): HTMLElement[]
    {
        return this._$elements;
    }
}