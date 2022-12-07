/**
 * フィルターのコントローラーに追加するHTMLを管理するクラス
 * Class that manages HTML to be added to the filter's controller
 *
 * @class
 * @memberOf view.controller
 */
class FilterHTML
{
    /**
     * @description フィルター表示で共通しているHTMLを返す
     *              Returns HTML that is common in the filter display
     *
     * @param  {number} id
     * @param  {string} name
     * @return {string}
     * @method
     * @public
     */
    static createHeaderHTML (id, name)
    {
        return `
<div id="filter-id-${id}" class="filter-border">

    <div class="filter-title">
        <i id="filter-title-arrow-${id}" class="arrow active"></i>
        <span id="filter-name-${id}" data-filter-id="${id}">${name}</span>
        <i class="filter-active" id="filter-state-${id}" data-filter-id="${id}" data-detail="{{フィルターを表示・非表示する}}"></i>
        <i class="trash" id="trash-${id}" data-filter-id="${id}" data-detail="{{フィルターを削除}}"></i>
    </div>
    
    <div id="filter-view-area-${id}" class="filter-view-area">
    
        <div class="filter-view-area-left">
        
            <div id="filter-${id}-lock" data-filter-id="${id}" class="filter-lock">
                ┌
                <div class="disable" data-detail="{{比率を固定}}"></div>
                └
            </div>
        
        </div>
`;
    }

    /**
     * @description BlurXのHTMLタグを返す
     *              Return BlurX HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createBlurX (id, value)
    {
        return `
<div class="filter-text">BlurX</div>
<div><input type="text" id="blurX-${id}" value="${value}" data-name="blurX" data-filter-id="${id}" data-detail="{{水平方向にぼかす}}" autocomplete="off"></div>
`;
    }

    /**
     * @description BlurYのHTMLタグを返す
     *              Return BlurY HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createBlurY (id, value)
    {
        return `
<div class="filter-text">BlurY</div>
<div><input type="text" id="blurY-${id}" value="${value}" data-name="blurY" data-filter-id="${id}" data-detail="{{垂直方向にぼかす}}" autocomplete="off"></div>
`;
    }

    /**
     * @description StrengthのHTMLタグを返す
     *              Return Strength HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createStrength (id, value)
    {
        return `
<div class="filter-text">Strength</div>
<div><input type="text" id="strength-${id}" value="${value}" data-filter-id="${id}" data-name="strength" data-detail="{{フィルター強度}}" autocomplete="off"></div>
`;
    }

    /**
     * @description AngleのHTMLタグを返す
     *              Return Angle HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createAngle (id, value)
    {
        return `
<div class="filter-text">Angle</div>
<div><input type="text" id="angle-${id}" value="${value}" data-filter-id="${id}" data-name="angle" data-detail="{{フィルター角度}}" autocomplete="off"></div>
`;
    }

    /**
     * @description AngleのHTMLタグを返す
     *              Return Angle HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createDistance (id, value)
    {
        return `
<div class="filter-text">Distance</div>
<div><input type="text" id="distance-${id}" value="${value}" data-filter-id="${id}" data-name="distance" data-detail="{{フィルター距離}}" autocomplete="off"></div>
`;
    }

    /**
     * @description ShadowColorのHTMLタグを返す
     *              Return ShadowColor HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createShadowColor (id, value)
    {
        return `
<div class="filter-text">Shadow<br>Color</div>
<div><input type="color" id="shadowColor-${id}" value="#${value.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="shadowColor" data-detail="{{シャドウのカラー}}"></div>
`;
    }

    /**
     * @description ShadowAlphaのHTMLタグを返す
     *              Return ShadowAlpha HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createShadowAlpha (id, value)
    {
        return `
<div class="filter-text">Shadow<br>Alpha</div>
<div><input type="text" id="shadowAlpha-${id}" value="${value}" data-filter-id="${id}" data-name="shadowAlpha" data-detail="{{シャドウのアルファ}}" autocomplete="off"></div>
`;
    }

    /**
     * @description HighlightColorのHTMLタグを返す
     *              Return HighlightColor HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createHighlightColor (id, value)
    {
        return `
<div class="filter-text">Highlight<br>Color</div>
<div><input type="color" id="highlightColor-${id}" value="#${value.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="highlightColor" data-detail="{{ハイライトのカラー}}"></div>
`;
    }

    /**
     * @description HighlightAlphaのHTMLタグを返す
     *              Return HighlightAlpha HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createHighlightAlpha (id, value)
    {
        return `
<div class="filter-text">Highlight<br>Alpha</div>
<div><input type="text" id="highlightAlpha-${id}" value="${value}" data-filter-id="${id}" data-name="highlightAlpha" data-detail="{{ハイライトのアルファ}}" autocomplete="off"></div>
`;
    }

    /**
     * @description KnockoutのHTMLタグを返す
     *              Return Knockout HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createKnockout (id)
    {
        return `
<div><input type="checkbox" id="knockout-${id}" data-name="knockout" data-filter-id="${id}"></div>
<div class="filter-text-long">
    <label for="knockout-${id}">Knockout</label>
</div>
`;
    }

    /**
     * @description BevelTypeのHTMLタグを返す
     *              Return BevelType HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createBevelType (id)
    {
        return `
<div class="filter-text-long">Type</div>
<div>
    <select id="type-${id}" data-name="type" data-filter-id="${id}">
        <option value="inner">Inner</option>
        <option value="outer">Outer</option>
        <option value="full">Full</option>
    </select>
</div>
`;
    }

    /**
     * @description QualityのHTMLタグを返す
     *              Return Quality HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createQuality (id)
    {
        return `
<div class="filter-text-long">Quality</div>
<div>
    <select id="quality-${id}" data-name="quality" data-filter-id="${id}">
        <option value="1">Low</option>
        <option value="2">Middle</option>
        <option value="3">High</option>
    </select>
</div>
`;
    }

    /**
     * @description InnerShadowのHTMLタグを返す
     *              Return InnerShadow HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createInnerShadow (id)
    {
        return `
<div><input type="checkbox" id="inner-${id}" data-name="inner" data-filter-id="${id}"></div>
<div class="filter-text-long">
    <label for="inner-${id}">Inner Shadow</label>
</div>
`;
    }

    /**
     * @description HideObjectのHTMLタグを返す
     *              Return HideObject HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createHideObject (id)
    {
        return `
<div><input type="checkbox" id="hideObject-${id}" data-name="hideObject" data-filter-id="${id}"></div>
<div class="filter-text-long">
    <label for="hideObject-${id}">Hide Object</label>
</div>
`;
    }

    /**
     * @description ColorのHTMLタグを返す
     *              Return Color HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createColor (id, value)
    {
        return `
<div class="filter-text">Color</div>
<div><input type="color" id="color-${id}" value="#${value.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="color" data-detail="{{シャドウのカラー}}"></div>
`;
    }

    /**
     * @description AlphaのHTMLタグを返す
     *              Return Alpha HTML
     *
     * @param  {number} id
     * @param  {number} value
     * @return {string}
     * @method
     * @static
     */
    static createAlpha (id, value)
    {
        return `
<div class="filter-text">Alpha</div>
<div><input type="text" id="alpha-${id}" value="${value}" data-filter-id="${id}" data-name="alpha" data-detail="{{シャドウのアルファ}}" autocomplete="off"></div>
`;
    }

    /**
     * @description GradientColorのHTMLタグを返す
     *              Return GradientColor HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createGradientColor (id)
    {
        return `
<div class="filter-text">Color</div>
<div><input type="color" id="gradientColor-${id}" value="#000000" data-filter-id="${id}" data-name="gradientColor" data-detail="{{グラデーションカラー}}"></div>
`;
    }

    /**
     * @description GradientAlphaのHTMLタグを返す
     *              Return GradientAlpha HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createGradientAlpha (id)
    {
        return `
<div class="filter-text">Alpha</div>
<div><input type="text" id="gradientAlpha-${id}" value="100" data-filter-id="${id}" data-name="gradientAlpha" data-detail="{{グラデーションのアルファ}}" autocomplete="off"></div>
        `;
    }

    /**
     * @description GradientColorPaletteのHTMLタグを返す
     *              Return GradientColorPalette HTML
     *
     * @param  {number} id
     * @return {string}
     * @method
     * @static
     */
    static createGradientColorPalette (id)
    {
        return `
<div id="gradient-color-palette-${id}" class="gradient-color-palette">
    <div id="color-palette-${id}" class="color-palette">
        <canvas id="gradient-canvas-${id}"></canvas>
    </div>
    <div id="color-pointer-list-${id}" data-filter-id="${id}" class="color-pointer-list" data-detail="{{カラーポインターを追加}}"></div>
</div>
`;
    }
}
