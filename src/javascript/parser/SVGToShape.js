/**
 * @class
 * @memberOf parser
 */
class SVGToShape
{
    /**
     * @param  {string} value
     * @param  {MovieClip} movie_clip
     * @param  {number} [folder_id = 0]
     * @return {void}
     * @method
     * @static
     */
    static parse (value, movie_clip, folder_id = 0)
    {
        const dom = new DOMParser()
            .parseFromString(value, "image/svg+xml");

        const svg = dom.children[0];
        if (svg.tagName !== "svg") {
            return ;
        }

        const parentAttributeMap = new Map();
        const attributes = svg.attributes;
        const length = attributes.length;
        for (let idx = 0; idx < length; ++idx) {
            const attribute = attributes[idx];
            if (attribute.name === "style") {
                continue;
            }

            parentAttributeMap.set(
                attribute.name,
                attribute.value
            );
        }

        if (svg.hasAttribute("style")) {
            const style = svg.style;
            const length = style.length;
            for (let idx = 0; idx < length; ++idx) {
                const name = style[idx];
                parentAttributeMap.set(name, style[name]);
            }
        }

        SVGToShape.parent = svg;
        SVGToShape.parseElement(
            svg, movie_clip,
            parentAttributeMap,
            new Map(),
            folder_id
        );

        const layers = [];
        for (const layer of movie_clip._$layers.values()) {
            layers.unshift(layer);
        }

        movie_clip.clearLayer();
        for (let idx = 0; idx < layers.length; ++idx) {
            movie_clip.setLayer(idx, layers[idx]);
        }

        SVGToShape.parent = null;
    }

    /**
     * @param  {Element}   node
     * @param  {MovieClip} movie_clip
     * @param  {Map}       group_attribute_map
     * @param  {Map}       global_style
     * @param  {number}    [folder_id=0]
     * @param  {boolean}   [clip=false]
     * @return {void}
     * @method
     * @static
     */
    static parseElement (
        node, movie_clip, group_attribute_map, global_style,
        folder_id = 0, clip = false
    ) {

        const children = node.children;
        const length = children.length;
        for (let idx = 0; length > idx; ++idx) {

            const element = children[idx];

            let movieClip = null;
            let clipPath  = null;

            if (element.tagName.toLowerCase() !== "use") {

                if (element.hasAttribute("clip-path")) {
                    clipPath = /url\((.+?)\)/gi
                        .exec(element
                            .getAttribute("clip-path")
                            .replace(/#/gi, "")
                            .replace(/"/gi, "")
                            .replace(/'/gi, "")
                        )[1];
                }

                if (element.style && element.style.clipPath) {
                    clipPath = /url\((.+?)\)/gi
                        .exec(element
                            .style
                            .clipPath
                            .replace(/#/gi, "")
                            .replace(/"/gi, "")
                            .replace(/'/gi, "")
                        )[1];
                }

                if (!clipPath && element.hasAttribute("class")) {

                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {
                        const name = classList[idx];

                        let classObject = null;
                        if (global_style.has(`#${name}`)) {
                            classObject = global_style.get(`#${name}`);
                        }

                        if (global_style.has(`.${name}`)) {
                            classObject = global_style.get(`.${name}`);
                        }

                        if (classObject && classObject.style.clipPath !== "") {

                            clipPath = /url\((.+?)\)/gi
                                .exec(classObject
                                    .style
                                    .clipPath
                                    .replace(/#/gi, "")
                                    .replace(/"/gi, "")
                                    .replace(/'/gi, "")
                                )[1];

                            break;
                        }
                    }
                }

                if (clipPath) {

                    const targetElement = SVGToShape
                        .parent
                        .getElementById(clipPath);

                    if (targetElement) {

                        movieClip = SVGToShape.createMovieClip(
                            movie_clip,
                            targetElement,
                            group_attribute_map,
                            global_style,
                            folder_id
                        );

                        SVGToShape.parseElement(
                            targetElement,
                            movieClip,
                            group_attribute_map,
                            global_style,
                            folder_id,
                            true
                        );
                    }
                }
            }

            let groupAttributeMap = null;
            switch (element.tagName.toLowerCase()) {

                case "path":
                    SVGToShape.createGraphics(
                        element,
                        movieClip || movie_clip,
                        group_attribute_map,
                        global_style,
                        null,
                        folder_id,
                        clip
                    );
                    break;

                case "g":
                    {
                        groupAttributeMap = new Map();

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];
                            if (attribute.name === "style") {
                                continue;
                            }

                            groupAttributeMap.set(
                                attribute.name,
                                attribute.value
                            );
                        }

                        for (const [name, value] of group_attribute_map) {

                            if (groupAttributeMap.has(name)) {
                                continue;
                            }

                            groupAttributeMap.set(name, value);
                        }

                        const style = element.style;
                        for (let idx = 0; idx < style.length; ++idx) {
                            const name = style[idx];
                            groupAttributeMap.set(
                                name,
                                element.style[name]
                            );
                        }
                    }
                    break;

                case "rect":
                    {
                        const x = element.hasAttribute("x")
                            ? parseFloat(element.getAttribute("x"))
                            : 0;

                        const y = element.hasAttribute("y")
                            ? parseFloat(element.getAttribute("y"))
                            : 0;

                        const width = element.hasAttribute("width")
                            ? parseFloat(element.getAttribute("width"))
                            : 0;

                        const height = element.hasAttribute("height")
                            ? parseFloat(element.getAttribute("height"))
                            : 0;

                        if (!width || !height) {
                            continue;
                        }

                        const commands = [];
                        if (element.hasAttribute("rx") || element.hasAttribute("ry")) {

                            const rx = parseFloat(element.getAttribute("rx"));
                            const ry = parseFloat(element.getAttribute("ry"));

                            const hew = rx / 2;
                            const heh = ry / 2;
                            const c   = 4 / 3 * (Math.SQRT2 - 1);
                            const cw  = c * hew;
                            const ch  = c * heh;

                            const dx0 = x   + hew;
                            const dx1 = x   + width;
                            const dx2 = dx1 - hew;

                            const dy0 = y   + heh;
                            const dy1 = y   + height;
                            const dy2 = dy1 - heh;

                            commands.push(
                                {
                                    "type": SVGCommandTypes.MOVE_TO,
                                    "relative": false,
                                    "x": dx0,
                                    "y": y
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": dx2,
                                    "y": y
                                },
                                {
                                    "type": SVGCommandTypes.CURVE_TO,
                                    "relative": false,
                                    "x1": dx2 + cw,
                                    "y1": y,
                                    "x2": dx1,
                                    "y2": dy0 - ch,
                                    "x": dx1,
                                    "y": dy0
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": dx1,
                                    "y": dy2
                                },
                                {
                                    "type": SVGCommandTypes.CURVE_TO,
                                    "relative": false,
                                    "x1": dx1,
                                    "y1": dy2 + ch,
                                    "x2": dx2 + cw,
                                    "y2": dy1,
                                    "x": dx2,
                                    "y": dy1
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": dx0,
                                    "y": dy1
                                },
                                {
                                    "type": SVGCommandTypes.CURVE_TO,
                                    "relative": false,
                                    "x1": dx0 - cw,
                                    "y1": dy1,
                                    "x2": x,
                                    "y2": dy2 + ch,
                                    "x": x,
                                    "y": dy2
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": x,
                                    "y": dy0
                                },
                                {
                                    "type": SVGCommandTypes.CURVE_TO,
                                    "relative": false,
                                    "x1": x,
                                    "y1": dy0 - ch,
                                    "x2": dx0 - cw,
                                    "y2": y,
                                    "x": dx0,
                                    "y": y
                                }
                            );

                        } else {

                            commands.push(
                                {
                                    "type": SVGCommandTypes.MOVE_TO,
                                    "relative": false,
                                    "x": x,
                                    "y": y
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": x + width,
                                    "y": y
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": x + width,
                                    "y": y + height
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": x,
                                    "y": y + height
                                },
                                {
                                    "type": SVGCommandTypes.LINE_TO,
                                    "relative": false,
                                    "x": x,
                                    "y": y
                                }
                            );
                        }

                        const path = document.createElement("path");
                        path.dataset.type = "rect";

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];
                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        SVGToShape.createGraphics(
                            path,
                            movieClip || movie_clip,
                            group_attribute_map,
                            global_style,
                            commands,
                            folder_id,
                            clip
                        );
                    }
                    break;

                case "circle":
                    {
                        const x = element.hasAttribute("cx")
                            ? parseFloat(element.getAttribute("cx"))
                            : 0;

                        const y = element.hasAttribute("cy")
                            ? parseFloat(element.getAttribute("cy"))
                            : 0;

                        const r = element.hasAttribute("r")
                            ? parseFloat(element.getAttribute("r"))
                            : 0;

                        if (!r) {
                            continue;
                        }

                        const commands = [
                            {
                                "type": SVGCommandTypes.MOVE_TO,
                                "relative": false,
                                "x": x - r,
                                "y": y
                            },
                            {
                                "type": SVGCommandTypes.ARC,
                                "relative": false,
                                "x": x + r,
                                "y": y,
                                "rX": r,
                                "rY": r,
                                "lArcFlag": 0,
                                "sweepFlag": 0,
                                "xRot": 180
                            },
                            {
                                "type": SVGCommandTypes.ARC,
                                "relative": false,
                                "x": x - r,
                                "y": y,
                                "rX": r,
                                "rY": r,
                                "lArcFlag": 0,
                                "sweepFlag": 0,
                                "xRot": 180
                            },
                            {
                                "type": SVGCommandTypes.CIRCLE,
                                "x": x,
                                "y": y
                            }
                        ];

                        const path = document.createElement("path");
                        path.dataset.type = "circle";

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];
                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        SVGToShape.createGraphics(
                            path,
                            movieClip || movie_clip,
                            group_attribute_map,
                            global_style,
                            commands,
                            folder_id,
                            clip
                        );
                    }
                    break;

                case "ellipse":
                    {
                        const x = element.hasAttribute("cx")
                            ? parseFloat(element.getAttribute("cx"))
                            : 0;

                        const y = element.hasAttribute("cy")
                            ? parseFloat(element.getAttribute("cy"))
                            : 0;

                        const rx = element.hasAttribute("rx")
                            ? parseFloat(element.getAttribute("rx"))
                            : 0;

                        const ry = element.hasAttribute("ry")
                            ? parseFloat(element.getAttribute("ry"))
                            : 0;

                        const commands = [
                            {
                                "type": SVGCommandTypes.MOVE_TO,
                                "relative": false,
                                "x": x - rx,
                                "y": y
                            },
                            {
                                "type": SVGCommandTypes.ARC,
                                "relative": false,
                                "x": x + rx,
                                "y": y,
                                "rX": rx,
                                "rY": ry,
                                "lArcFlag": 0,
                                "sweepFlag": 0,
                                "xRot": 180
                            },
                            {
                                "type": SVGCommandTypes.ARC,
                                "relative": false,
                                "x": x - rx,
                                "y": y,
                                "rX": rx,
                                "rY": ry,
                                "lArcFlag": 0,
                                "sweepFlag": 0,
                                "xRot": 180
                            },
                            {
                                "type": SVGCommandTypes.CIRCLE,
                                "x": x,
                                "y": y
                            }
                        ];

                        const path = document.createElement("path");
                        path.dataset.type = "ellipse";

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];
                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        SVGToShape.createGraphics(
                            path,
                            movieClip || movie_clip,
                            group_attribute_map,
                            global_style,
                            commands,
                            folder_id,
                            clip
                        );
                    }
                    break;

                case "polygon":
                case "polyline":
                    {
                        if (!element.hasAttribute("points")) {
                            continue;
                        }

                        const points = element.getAttribute("points");
                        const values = SVGToShape._$adjParam(points
                            .replace(/,/g, " ")
                            .replace(/-/g, " -")
                            .trim()
                            .split(" "));

                        const commands = [{
                            "type": SVGCommandTypes.MOVE_TO,
                            "relative": false,
                            "x": +values[0],
                            "y": +values[1]
                        }];

                        for (let idx = 2; idx < values.length; idx += 2) {
                            commands.push({
                                "type": SVGCommandTypes.LINE_TO,
                                "relative": false,
                                "x": +values[idx],
                                "y": +values[idx + 1]
                            });
                        }

                        if (element.tagName === "polygon") {
                            commands.push({
                                "type": SVGCommandTypes.CLOSE_PATH
                            });
                        }

                        const path = document.createElement("path");
                        path.dataset.type = "polyline";

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];

                            if (attribute.name === "points") {
                                continue;
                            }

                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        SVGToShape.createGraphics(
                            path,
                            movieClip || movie_clip,
                            group_attribute_map,
                            global_style,
                            commands,
                            folder_id,
                            clip
                        );
                    }
                    break;

                case "line":
                    {
                        const x1 = element.hasAttribute("x1")
                            ? parseFloat(element.getAttribute("x1"))
                            : 0;

                        const y1 = element.hasAttribute("y1")
                            ? parseFloat(element.getAttribute("y1"))
                            : 0;

                        const x2 = element.hasAttribute("x2")
                            ? parseFloat(element.getAttribute("x2"))
                            : 0;

                        const y2 = element.hasAttribute("y2")
                            ? parseFloat(element.getAttribute("y2"))
                            : 0;

                        if (x1 === x2 && y1 === y2) {
                            continue;
                        }

                        const commands = [
                            {
                                "type": SVGCommandTypes.MOVE_TO,
                                "relative": false,
                                "x": x1,
                                "y": y1
                            },
                            {
                                "type": SVGCommandTypes.LINE_TO,
                                "relative": false,
                                "x": x2,
                                "y": y2
                            }
                        ];

                        const path = document.createElement("path");
                        path.dataset.type = "line";

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];
                            switch (attribute.name) {

                                case "x1":
                                case "y1":
                                case "x2":
                                case "y2":
                                    continue;

                            }

                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        SVGToShape.createGraphics(
                            path,
                            movieClip || movie_clip,
                            group_attribute_map,
                            global_style,
                            commands,
                            folder_id,
                            clip
                        );
                    }
                    break;

                case "style":
                    {
                        const rules  = element.sheet.cssRules;
                        const length = rules.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const node = rules[idx];
                            global_style.set(node.selectorText, node);
                        }
                    }
                    break;

                case "use":
                    {
                        let id = null;
                        switch (true) {

                            case element.hasAttribute("href"):
                                id = element
                                    .getAttribute("href")
                                    .slice(1);
                                break;

                            case element.hasAttribute("xlink:href"):
                                id = element
                                    .getAttribute("xlink:href")
                                    .slice(1);
                                break;

                            default:
                                break;

                        }

                        if (!id) {
                            continue;
                        }

                        const node = SVGToShape
                            .parent
                            .getElementById(id);

                        const path = document.createElement("path");

                        const attributes = element.attributes;
                        const length = attributes.length;
                        for (let idx = 0; idx < length; ++idx) {
                            const attribute = attributes[idx];
                            switch (attribute.name) {

                                case "href":
                                case "xlink:href":
                                    continue;

                            }

                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        const nodeAttributes = node.attributes;
                        const nodeLength = nodeAttributes.length;
                        for (let idx = 0; idx < nodeLength; ++idx) {
                            const attribute = nodeAttributes[idx];

                            path.setAttribute(
                                attribute.name,
                                attribute.value
                            );
                        }

                        const parent = document.createElement("element");
                        parent.appendChild(path);

                        SVGToShape.parseElement(
                            parent,
                            movie_clip,
                            group_attribute_map,
                            global_style,
                            folder_id
                        );
                    }
                    continue;

                case "clippath":
                    if (!clip) {
                        continue;
                    }
                    break;

                default:
                    break;

            }

            SVGToShape.parseElement(
                element,
                movieClip || movie_clip,
                groupAttributeMap || group_attribute_map,
                global_style,
                folder_id
            );

            if (movieClip) {
                for (const [id, layer] of movieClip._$layers) {

                    if (!id) {
                        continue;
                    }

                    layer.mode   = LayerMode.MASK_IN;
                    layer.maskId = 0;
                }
                movieClip = null;
            }
        }
    }

    /**
     * @param  {MovieClip} movie_clip
     * @param  {Element} element
     * @param  {Map} group_attribute_map
     * @param  {Map} global_style
     * @param  {number} [folder_id=0]
     * @return {MovieClip}
     * @method
     * @static
     */
    static createMovieClip (
        movie_clip, element, group_attribute_map, global_style,
        folder_id = 0
    ) {
        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;

        const movieClip = workSpace.addLibrary(
            Util
                .$libraryController
                .createInstance(InstanceType.MOVIE_CLIP, `MovieClip_${id}`, id)
        );
        movieClip.folderId = folder_id;

        const layer = new Layer();
        layer.name  = `Layer_${movie_clip._$layers.size}`;

        movie_clip.setLayer(movie_clip._$layers.size, layer);

        const character = new Character();
        character.libraryId  = movieClip.id;

        const location = layer.adjustmentLocation(1);
        character.startFrame = location.startFrame;
        character.endFrame   = location.endFrame;

        let x = 0;
        let y = 0;
        if (element.hasAttribute("transform")) {
            const transform = element.getAttribute("transform");
            if (transform.indexOf("translate") > -1) {
                const point = SVGToShape.getTranslate(transform);
                x += point.x;
                y += point.y;
            }
        }

        if (group_attribute_map.has("transform")) {
            const transform = group_attribute_map.get("transform");
            if (transform.indexOf("translate") > -1) {
                const point = SVGToShape.getTranslate(transform);
                x += point.x;
                y += point.y;
            }
        }

        if (global_style.has("transform")) {
            const transform = global_style.get("transform");
            if (transform.indexOf("translate") > -1) {
                const point = SVGToShape.getTranslate(transform);
                x += point.x;
                y += point.y;
            }
        }

        character.setPlace(location.startFrame, {
            "frame": location.startFrame,
            "matrix": [1, 0, 0, 1, isNaN(x) ? 0 : x, isNaN(y) ? 0 : y],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "loop": Util.$getDefaultLoopConfig(),
            "depth": layer._$characters.length
        });
        layer.addCharacter(character);

        return movieClip;
    }

    /**
     * @param  {MovieClip} movie_clip
     * @param  {Element} element
     * @param  {Map} group_attribute_map
     * @param  {Map} global_style
     * @param  {number} [folder_id=0]
     * @param  {boolean} [clip=false]
     * @return {Shape}
     * @method
     * @static
     */
    static createShape (
        movie_clip, element, group_attribute_map, global_style,
        folder_id = 0, clip = false, alpha = 1
    ) {

        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;

        const shape = workSpace.addLibrary(
            Util
                .$libraryController
                .createInstance(InstanceType.SHAPE, `Shape_${id}`, id)
        );
        shape.folderId = folder_id;

        const layer = new Layer();
        layer.name  = `Layer_${movie_clip._$layers.size}`;
        if (clip) {
            layer.mode = LayerMode.MASK;
        }

        movie_clip.setLayer(movie_clip._$layers.size, layer);

        const character = new Character();
        character.libraryId  = shape.id;

        const location = layer.adjustmentLocation(1);
        character.startFrame = location.startFrame;
        character.endFrame   = location.endFrame;

        let x = 0;
        let y = 0;
        // if (element.hasAttribute("x")) {
        //     x += parseFloat(element.getAttribute("x"));
        // }

        // if (element.hasAttribute("y")) {
        //     y += parseFloat(element.getAttribute("y"));
        // }

        if (element.hasAttribute("transform")) {
            const transform = element.getAttribute("transform");
            if (transform.indexOf("translate") > -1) {
                const point = SVGToShape.getTranslate(transform);
                x += point.x;
                y += point.y;
            }
        }

        if (group_attribute_map.has("transform")) {
            const transform = group_attribute_map.get("transform");
            if (transform.indexOf("translate") > -1) {
                const point = SVGToShape.getTranslate(transform);
                x += point.x;
                y += point.y;
            }
        }

        if (global_style.has("transform")) {
            const transform = global_style.get("transform");
            if (transform.indexOf("translate") > -1) {
                const point = SVGToShape.getTranslate(transform);
                x += point.x;
                y += point.y;
            }
        }

        character.setPlace(location.startFrame, {
            "frame": location.startFrame,
            "matrix": [1, 0, 0, 1, isNaN(x) ? 0 : x, isNaN(y) ? 0 : y],
            "colorTransform": [1, 1, 1, alpha, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": layer._$characters.length
        });
        layer.addCharacter(character);

        return shape;
    }

    /**
     * @param  {Element} element
     * @param  {Map} group_attribute_map
     * @param  {Map} global_style
     * @return {object}
     * @method
     * @static
     */
    static getFillObject (element, group_attribute_map, global_style)
    {
        let colorValue = null;
        switch (true) {

            case element.hasAttribute("fill"):
                colorValue = element.getAttribute("fill");
                break;

            case element.style.fill !== "":
                colorValue = element.style.fill;
                break;

            case group_attribute_map.has("fill"):
                colorValue = group_attribute_map.get("fill");
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {
                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.fill === "") {
                            continue;
                        }

                        colorValue = rule.style.fill;

                    }
                }
                break;

        }

        let alphaValue = null;
        switch (true) {

            case element.hasAttribute("fill-opacity"):
                alphaValue = element.getAttribute("fill-opacity");
                break;

            case element.hasAttribute("opacity"):
                alphaValue = element.getAttribute("opacity");
                break;

            case element.style.fillOpacity !== "":
                alphaValue = element.style.fillOpacity;
                break;

            case element.style.opacity !== "":
                alphaValue = element.style.opacity;
                break;

            case group_attribute_map.has("fill-opacity"):
                alphaValue = group_attribute_map.get("fill-opacity");
                break;

            case group_attribute_map.has("opacity"):
                alphaValue = group_attribute_map.get("opacity");
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.fillOpacity !== "") {
                            alphaValue = rule.style.fillOpacity;
                        }

                        if (rule.style.opacity !== "") {
                            alphaValue = rule.style.opacity;
                        }

                        break;
                    }
                }
                break;

        }

        let alpha = alphaValue === null ? 1 : +alphaValue;
        let color = 0;
        let gradient = null;
        if (colorValue) {
            switch (true) {

                case colorValue.indexOf("rgba") > -1:
                    {
                        const colors = /rgba\((.+?)\)/gi
                            .exec(colorValue)[1]
                            .trim()
                            .split(",");

                        color = "0x";
                        color += parseInt(colors[0].trim()).toString(16);
                        color += parseInt(colors[1].trim()).toString(16);
                        color += parseInt(colors[2].trim()).toString(16);
                        color |= 0;

                        alpha = +colors[3].trim();
                    }
                    break;

                case colorValue.indexOf("rgb") > -1:
                    {
                        const colors = /rgb\((.+?)\)/gi
                            .exec(colorValue)[1]
                            .trim()
                            .split(",");

                        color = "0x";
                        color += parseInt(colors[0].trim()).toString(16);
                        color += parseInt(colors[1].trim()).toString(16);
                        color += parseInt(colors[2].trim()).toString(16);
                        color |= 0;
                    }
                    break;

                case colorValue.indexOf("url") > -1:
                    {
                        gradient = {};

                        colorValue = colorValue.replace(/"/g, "");

                        const id = /url\(#(.+?)\)/gi
                            .exec(colorValue)[1]
                            .trim();

                        const node = SVGToShape
                            .parent
                            .getElementById(id);

                        let parentNode = null;
                        let children = null;
                        switch (true) {

                            case node.hasAttribute("href"):
                                {
                                    const href = node
                                        .getAttribute("href")
                                        .slice(1);

                                    parentNode = SVGToShape
                                        .parent
                                        .getElementById(href);

                                    if (parentNode) {
                                        children = parentNode.children;
                                    }
                                }
                                break;

                            case node.hasAttribute("xlink:href"):
                                {
                                    const href = node
                                        .getAttribute("xlink:href")
                                        .slice(1);

                                    parentNode = SVGToShape
                                        .parent
                                        .getElementById(href);

                                    if (parentNode) {
                                        children = parentNode.children;
                                    }
                                }
                                break;

                            default:
                                children = node.children;
                                break;

                        }

                        if (!children) {
                            children = node.children;
                        }

                        gradient.spreadMethod = "pad";
                        if (node.hasAttribute("spreadMethod")) {
                            gradient.spreadMethod = node.getAttribute("spreadMethod");
                        } else {
                            if (parentNode && parentNode.hasAttribute("spreadMethod")) {
                                gradient.spreadMethod = parentNode.getAttribute("spreadMethod");
                            }
                        }

                        gradient.gradientUnits = null;
                        if (node.hasAttribute("gradientUnits")) {
                            gradient.gradientUnits = node.getAttribute("gradientUnits");
                        } else {
                            if (parentNode && parentNode.hasAttribute("gradientUnits")) {
                                gradient.gradientUnits = parentNode.getAttribute("gradientUnits");
                            }
                        }

                        if (node.nodeName === "radialGradient") {

                            gradient.type = "radial";

                            gradient.cx = 0;
                            if (node.hasAttribute("cx")) {
                                gradient.cx = parseFloat(node.getAttribute("cx"));
                            } else {
                                if (parentNode && parentNode.hasAttribute("cx")) {
                                    gradient.cx = parseFloat(parentNode.getAttribute("cx"));
                                }
                            }

                            gradient.cy = 0;
                            if (node.hasAttribute("cy")) {
                                gradient.cy = parseFloat(node.getAttribute("cy"));
                            } else {
                                if (parentNode && parentNode.hasAttribute("cy")) {
                                    gradient.cy = parseFloat(parentNode.getAttribute("cy"));
                                }
                            }

                            gradient.r = 0;
                            if (node.hasAttribute("r")) {
                                gradient.r = parseFloat(node.getAttribute("r"));
                            } else {
                                if (parentNode && parentNode.hasAttribute("r")) {
                                    gradient.r = parseFloat(parentNode.getAttribute("r"));
                                }
                            }

                            gradient.fx = gradient.cx;
                            if (node.hasAttribute("fx")) {
                                gradient.fx = parseFloat(node.getAttribute("fx"));
                            } else {
                                if (parentNode && parentNode.hasAttribute("r")) {
                                    gradient.r = parseFloat(parentNode.getAttribute("r"));
                                }
                            }

                            gradient.fy = gradient.cy;
                            if (node.hasAttribute("fy")) {
                                gradient.fy = parseFloat(node.getAttribute("fy"));
                            } else {
                                if (parentNode && parentNode.hasAttribute("fy")) {
                                    gradient.fy = parseFloat(parentNode.getAttribute("fy"));
                                }
                            }

                            gradient.fr = gradient.r;
                            if (node.hasAttribute("fr")) {
                                gradient.fr = parseFloat(node.getAttribute("fr"));
                            } else {
                                if (parentNode && parentNode.hasAttribute("fr")) {
                                    gradient.fr = parseFloat(parentNode.getAttribute("fr"));
                                }
                            }

                        } else {
                            gradient.type = "linear";

                            gradient.x1 = 0;
                            if (node.hasAttribute("x1")) {
                                const value = node.getAttribute("x1");
                                gradient.x1 = value.indexOf("%") > -1
                                    ? parseFloat(value) / 100
                                    : parseFloat(value);
                            } else {
                                if (parentNode && parentNode.hasAttribute("x1")) {
                                    const value = parentNode.getAttribute("x1");
                                    gradient.x1 = value.indexOf("%") > -1
                                        ? parseFloat(value) / 100
                                        : parseFloat(value);
                                }
                            }

                            gradient.y1 = 0;
                            if (node.hasAttribute("y1")) {
                                const value = node.getAttribute("y1");
                                gradient.y1 = value.indexOf("%") > -1
                                    ? parseFloat(value) / 100
                                    : parseFloat(value);
                            } else {
                                if (parentNode && parentNode.hasAttribute("y1")) {
                                    const value = parentNode.getAttribute("y1");
                                    gradient.y1 = value.indexOf("%") > -1
                                        ? parseFloat(value) / 100
                                        : parseFloat(value);
                                }
                            }

                            gradient.x2 = 0;
                            if (node.hasAttribute("x2")) {
                                const value = node.getAttribute("x2");
                                gradient.x2 = value.indexOf("%") > -1
                                    ? parseFloat(value) / 100
                                    : parseFloat(value);
                            } else {
                                if (parentNode && parentNode.hasAttribute("x2")) {
                                    const value = parentNode.getAttribute("x2");
                                    gradient.x2 = value.indexOf("%") > -1
                                        ? parseFloat(value) / 100
                                        : parseFloat(value);
                                }
                            }

                            gradient.y2 = 0;
                            if (node.hasAttribute("y2")) {
                                const value = node.getAttribute("y2");
                                gradient.y2 = value.indexOf("%") > -1
                                    ? parseFloat(value) / 100
                                    : parseFloat(value);
                            } else {
                                if (parentNode && parentNode.hasAttribute("y2")) {
                                    const value = parentNode.getAttribute("y2");
                                    gradient.y2 = value.indexOf("%") > -1
                                        ? parseFloat(value) / 100
                                        : parseFloat(value);
                                }
                            }
                        }

                        if (node.hasAttribute("gradientTransform")) {
                            gradient.transform = node
                                .getAttribute("gradientTransform")
                                .trim();
                        } else {
                            if (parentNode && parentNode.hasAttribute("gradientTransform")) {
                                gradient.transform = parentNode
                                    .getAttribute("gradientTransform")
                                    .trim();
                            }
                        }

                        const { Matrix } = next2d.geom;
                        gradient.matrix = new Matrix();

                        const colors = [];
                        const alphas = [];
                        const ratios = [];
                        for (let idx = 0; idx < children.length; ++idx) {
                            const node = children[idx];

                            const attributes = node.attributes;
                            const length = attributes.length;
                            for (let jdx = 0; jdx < length; ++jdx) {
                                const attribute = attributes[jdx];

                                switch (attribute.name) {

                                    case "offset":
                                        ratios[idx] = attribute.value.indexOf("%") > -1
                                            ? parseFloat(attribute.value) / 100 * 255
                                            : +attribute.value * 255;
                                        break;

                                    case "stop-color":
                                        {
                                            const value = attribute.value;
                                            switch (true) {

                                                case value.indexOf("rgb") > -1:
                                                    colors[idx] = SVGToShape.rgbToInt(value);
                                                    break;

                                                case value.indexOf("%") > -1:
                                                    colors[idx] = parseFloat(value) / 100;
                                                    break;

                                                default:
                                                    colors[idx] = value;
                                                    break;

                                            }
                                        }
                                        break;

                                    case "stop-opacity":
                                        alphas[idx] = +attribute.value;
                                        break;

                                }
                            }

                            if (!(idx in colors)) {
                                colors[idx] = "#000";
                            }

                            if (!(idx in alphas)) {
                                alphas[idx] = 1;
                            }
                        }

                        gradient.colors = colors;
                        gradient.alphas = alphas;
                        gradient.ratios = ratios;
                    }
                    break;

                case colorValue === "transparent":
                case colorValue === "none":
                    alpha = 0;
                    break;

                default:
                    color = colorValue;
                    break;

            }
        }

        return {
            "color": color,
            "gradient": gradient,
            "alpha": alpha
        };
    }

    /**
     * @param  {string} value
     * @return {object}
     * @method
     * @static
     */
    static getTranslate (value)
    {
        const translate = /translate\((.+?)\)/gi.exec(value)[1];

        const values = SVGToShape._$adjParam(translate
            .replace(/,/g, " ")
            .replace(/-/g, " -")
            .trim()
            .split(" "));

        const param = [];
        for (let idx = 0; idx < values.length; ++idx) {

            const value = values[idx];
            if (!value) {
                continue;
            }

            param.push(parseFloat(value));
        }

        return {
            "x": param[0],
            "y": param[1]
        };
    }

    /**
     * @param  {string} value
     * @return {number}
     * @method
     * @static
     */
    static getRotate (value)
    {
        const rotate = /rotate\((.+?)\)/gi.exec(value)[1];

        const values = SVGToShape._$adjParam(rotate
            .replace(/,/g, " ")
            .replace(/-/g, " -")
            .trim()
            .split(" "));

        const param = [];
        for (let idx = 0; idx < values.length; ++idx) {

            const value = values[idx];
            if (!value) {
                continue;
            }

            param.push(parseFloat(value));
        }

        return param[0] * (Math.PI / 180);
    }

    /**
     * @param  {string} value
     * @return {object}
     * @method
     * @static
     */
    static getScale (value)
    {
        const scale = /scale\((.+?)\)/gi.exec(value)[1];

        const values = SVGToShape._$adjParam(scale
            .replace(/,/g, " ")
            .replace(/-/g, " -")
            .trim()
            .split(" "));

        const param = [];
        for (let idx = 0; idx < values.length; ++idx) {

            const value = values[idx];
            if (!value) {
                continue;
            }

            param.push(parseFloat(value));
        }

        return {
            "x": param[0],
            "y": param[1]
        };
    }

    /**
     * @param  {string} value
     * @return {number}
     * @method
     * @static
     */
    static getSkewX (value)
    {
        const skewX = /skewX\((.+?)\)/gi.exec(value)[1];

        const values = SVGToShape._$adjParam(skewX
            .replace(/,/g, " ")
            .replace(/-/g, " -")
            .trim()
            .split(" "));

        const param = [];
        for (let idx = 0; idx < values.length; ++idx) {

            const value = values[idx];
            if (!value) {
                continue;
            }

            param.push(parseFloat(value));
        }

        return param[0] * (Math.PI / 180);
    }

    /**
     * @param  {string} value
     * @return {number}
     * @method
     * @static
     */
    static getSkewY (value)
    {
        const skewY = /skewY\((.+?)\)/gi.exec(value)[1];

        const values = SVGToShape._$adjParam(skewY
            .replace(/,/g, " ")
            .replace(/-/g, " -")
            .trim()
            .split(" "));

        const param = [];
        for (let idx = 0; idx < values.length; ++idx) {

            const value = values[idx];
            if (!value) {
                continue;
            }

            param.push(parseFloat(value));
        }

        return param[0] * (Math.PI / 180);
    }

    /**
     * @param  {string} value
     * @return {number}
     * @method
     * @static
     */
    static rgbToInt (value)
    {
        const colors = /rgb\((.+?)\)/gi
            .exec(value)[1]
            .trim()
            .split(",");

        color = "0x";
        color += parseInt(colors[0].trim()).toString(16);
        color += parseInt(colors[1].trim()).toString(16);
        color += parseInt(colors[2].trim()).toString(16);
        color |= 0;

        return color;
    }

    /**
     * @param  {Element} element
     * @param  {Map} group_attribute_map
     * @param  {Map} global_style
     * @return {object}
     * @method
     * @static
     */
    static getStrokeObject (element, group_attribute_map, global_style)
    {
        let caps = "none";
        switch (true) {

            case element.hasAttribute("stroke-linecap"):
                caps = element.getAttribute("stroke-linecap");
                break;

            case element.style.strokeLinecap !== "":
                caps = element.style.strokeLinecap;
                break;

            case group_attribute_map.has("stroke-linecap"):
                caps = group_attribute_map.get("stroke-linecap");
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {
                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.strokeLinecap === "") {
                            continue;
                        }

                        caps = rule.style.strokeLinecap;

                    }
                }
                break;

        }

        let join = "miter";
        switch (true) {

            case element.hasAttribute("stroke-linejoin"):
                join = element.getAttribute("stroke-linejoin");
                break;

            case element.style.strokeLinejoin !== "":
                join = element.style.strokeLinejoin;
                break;

            case group_attribute_map.has("stroke-linejoin"):
                join = group_attribute_map.get("stroke-linejoin");
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {
                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.strokeLinejoin === "") {
                            continue;
                        }

                        join = rule.style.strokeLinejoin;

                    }
                }
                break;

        }

        let colorValue = null;
        switch (true) {

            case element.hasAttribute("stroke"):
                colorValue = element.getAttribute("stroke");
                break;

            case element.style.stroke !== "":
                colorValue = element.style.stroke;
                break;

            case group_attribute_map.has("stroke"):
                colorValue = group_attribute_map.get("stroke");
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {
                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.stroke === "") {
                            continue;
                        }

                        colorValue = rule.style.stroke;

                    }
                }
                break;

        }

        let width = colorValue ? 1 : 0;
        switch (true) {

            case element.hasAttribute("stroke-width"):
                width = parseFloat(
                    element.getAttribute("stroke-width")
                );
                break;

            case element.style.strokeWidth !== "":
                width = parseFloat(element.style.strokeWidth);
                break;

            case group_attribute_map.has("stroke-width"):
                width = parseFloat(
                    group_attribute_map.get("stroke-width")
                );
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {
                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.strokeWidth === "") {
                            continue;
                        }

                        width = parseFloat(rule.style.strokeWidth);

                    }
                }
                break;

        }

        let alphaValue = null;
        switch (true) {

            case element.hasAttribute("stroke-opacity"):
                alphaValue = element.getAttribute("stroke-opacity");
                break;

            case element.hasAttribute("opacity"):
                alphaValue = element.getAttribute("opacity");
                break;

            case element.style.strokeOpacity !== "":
                alphaValue = element.style.strokeOpacity;
                break;

            case element.style.opacity !== "":
                alphaValue = element.style.opacity;
                break;

            case group_attribute_map.has("stroke-opacity"):
                alphaValue = group_attribute_map.get("stroke-opacity");
                break;

            case group_attribute_map.has("opacity"):
                alphaValue = group_attribute_map.get("opacity");
                break;

            default:
                {
                    const classList = element.classList;
                    const length = classList.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const name = classList[idx];

                        let rule = null;
                        switch (true) {

                            case global_style.has(`#${name}`):
                                rule = global_style.get(`#${name}`);
                                break;

                            case global_style.has(`.${name}`):
                                rule = global_style.get(`.${name}`);
                                break;

                            default:
                                continue;

                        }

                        if (!rule) {
                            continue;
                        }

                        if (rule.style.strokeOpacity !== "") {
                            alphaValue = rule.style.strokeOpacity;
                        }

                        if (rule.style.opacity !== "") {
                            alphaValue = rule.style.opacity;
                        }

                    }
                }
                break;

        }

        let alpha = alphaValue === null ? 1 : alphaValue;
        let color = 0;
        if (colorValue) {
            switch (true) {

                case colorValue.indexOf("rgba") > -1:
                    {
                        const colors = /rgba\((.+?)\)/gi
                            .exec(colorValue)[1]
                            .trim()
                            .split(",");

                        color = "0x";
                        color += +colors[0].trim();
                        color += +colors[1].trim();
                        color += +colors[2].trim();
                        color |= 0;

                        alpha = +colors[3].trim();
                    }
                    break;

                case colorValue.indexOf("rgb") > -1:
                    {
                        const colors = /rgb\((.+?)\)/gi
                            .exec(colorValue)[1]
                            .trim()
                            .split(",");

                        color = "0x";
                        color += +colors[0].trim();
                        color += +colors[1].trim();
                        color += +colors[2].trim();
                        color |= 0;
                    }
                    break;

                case colorValue === "transparent":
                case colorValue === "none":
                    alpha = 0;
                    break;

                default:
                    color = colorValue;
                    break;

            }
        }

        return {
            "color": color,
            "alpha": alpha,
            "width": width,
            "caps": caps === "butt" ? "none" : caps,
            "join": join
        };
    }

    /**
     * @param  {Element} element
     * @param  {Map} group_attribute_map
     * @return {SVGPathParser}
     * @method
     * @static
     */
    static createParser (element, group_attribute_map)
    {
        let parser = new SVGPathParser();

        for (let idx = 0; 2 > idx; ++idx) {

            let transform = null;
            switch (idx) {

                case 0:
                    if (group_attribute_map.size
                        && group_attribute_map.has("transform")
                    ) {
                        transform = group_attribute_map.get("transform");
                    }
                    break;

                case 1:
                    if (element.hasAttribute("transform")) {
                        transform = element.getAttribute("transform");
                    }
                    break;

                default:
                    break;

            }

            if (transform) {

                const names = [
                    "matrix",
                    "scale",
                    "rotate",
                    "skewX",
                    "skewY"
                ];

                const transforms = [];
                for (let idx = 0; names.length > idx; ++idx) {
                    const name = names[idx];
                    const index = transform.indexOf(name);
                    if (index === -1) {
                        continue;
                    }

                    transforms.push({
                        "index": index,
                        "name": name
                    });
                }

                // 昇順
                transforms.sort((a, b) =>
                {
                    if (a.index > b.index) {
                        return 1;
                    }

                    if (b.index > a.index) {
                        return -1;
                    }

                    return 0;
                });

                for (let idx = 0; transforms.length > idx; ++idx) {

                    const name = transforms[idx].name;

                    const values = SVGToShape._$adjParam(
                        new RegExp(`${name}\\((.+?)\\)`, "gi")
                            .exec(transform)[1]
                            .replace(/,/g, " ")
                            .replace(/-/g, " -")
                            .trim()
                            .split(" ")
                    );

                    const param = [];
                    for (let idx = 0; idx < values.length; ++idx) {

                        const value = values[idx];
                        if (!value) {
                            continue;
                        }

                        param.push(parseFloat(value));
                    }

                    parser = parser[name](
                        param[0], param[1], param[2],
                        param[3], param[4], param[5]
                    );
                }
            }
        }

        return parser;
    }

    /**
     * @param  {Element}   element
     * @param  {MovieClip} movie_clip
     * @param  {Map}       group_attribute_map
     * @param  {Map}       global_style
     * @param  {array}     [commands=null]
     * @param  {number}    [folder_id=0]
     * @param  {boolean}   [clip=false]
     * @return {void}
     * @method
     * @static
     */
    static createGraphics (
        element, movie_clip, group_attribute_map, global_style,
        commands = null, folder_id = 0, clip = false
    ) {
        if (!commands && !element.hasAttribute("d")) {
            return;
        }

        const { Shape, Graphics } = window.next2d.display;

        const graphics = new Shape().graphics;

        const fillObject = SVGToShape.getFillObject(
            element, group_attribute_map, global_style
        );

        if (clip || fillObject.alpha) {
            if (fillObject.gradient) {
                const gradient = fillObject.gradient;
                graphics.beginGradientFill(
                    gradient.type,
                    gradient.colors,
                    gradient.alphas,
                    gradient.ratios,
                    gradient.matrix
                );
            } else {
                graphics.beginFill(
                    fillObject.color,
                    fillObject.alpha
                );
            }
        }

        const shape = SVGToShape.createShape(
            movie_clip, element, group_attribute_map,
            global_style, folder_id, clip, fillObject.gradient ? fillObject.alpha : 1
        );

        const strokeObject = SVGToShape.getStrokeObject(
            element, group_attribute_map, global_style
        );
        if (strokeObject.width && strokeObject.alpha) {
            graphics.lineStyle(
                strokeObject.width,
                strokeObject.color,
                strokeObject.alpha,
                strokeObject.caps,
                strokeObject.join
            );
        }

        const parser = SVGToShape.createParser(
            element, group_attribute_map
        );

        let currentPointX = 0;
        let currentPointY = 0;
        let lastControlX  = 0;
        let lastControlY  = 0;

        if (!commands) {
            commands = parser.execute(element.getAttribute("d"));
        } else {
            parser._$commands = commands;
            parser.executeTransform();
        }

        for (let idx = 0; commands.length > idx; ++idx) {

            const command = commands[idx];
            switch (command.type) {

                case SVGCommandTypes.MOVE_TO:

                    if (command.relative) {
                        currentPointX += command.x;
                        currentPointY += command.y;
                    } else {
                        currentPointX = command.x;
                        currentPointY = command.y;
                    }

                    if (graphics._$lines && graphics._$lines.length > 1) {
                        graphics.endLine();
                        graphics._$pointerX = 0;
                        graphics._$pointerY = 0;
                        graphics.lineStyle(
                            strokeObject.width,
                            strokeObject.color,
                            strokeObject.alpha,
                            strokeObject.caps,
                            strokeObject.join
                        );
                    }

                    graphics.moveTo(
                        currentPointX,
                        currentPointY
                    );

                    break;

                case SVGCommandTypes.LINE_TO:

                    if (command.relative) {
                        currentPointX += command.x;
                        currentPointY += command.y;
                    } else {
                        currentPointX = command.x;
                        currentPointY = command.y;
                    }

                    lastControlX = currentPointX;
                    lastControlY = currentPointY;

                    graphics.lineTo(
                        currentPointX,
                        currentPointY
                    );
                    break;

                case SVGCommandTypes.CIRCLE:
                    lastControlX = currentPointX = command.x;
                    lastControlY = currentPointY = command.y;
                    break;

                case SVGCommandTypes.ARC:
                    {
                        let x = command.x;
                        let y = command.y;
                        if (command.relative) {
                            x += currentPointX;
                            y += currentPointY;
                        }

                        const curves = SVGToShape._$arcToCurve(
                            currentPointX, currentPointY,
                            x, y,
                            command.lArcFlag, command.sweepFlag,
                            command.rX, command.rY,
                            command.xRot
                        );

                        for (let idx = 0; idx < curves.length; ++idx) {
                            const curve = curves[idx];
                            graphics.cubicCurveTo(
                                curve[0], curve[1],
                                curve[2], curve[3],
                                curve[4], curve[5]
                            );
                        }

                        lastControlX = currentPointX = x;
                        lastControlY = currentPointY = y;
                    }
                    break;

                case SVGCommandTypes.CURVE_TO:
                    {
                        let cx1 = command.x1;
                        let cy1 = command.y1;
                        let cx2 = command.x2;
                        let cy2 = command.y2;
                        let x = command.x;
                        let y = command.y;
                        if (command.relative) {
                            cx1 += currentPointX;
                            cy1 += currentPointY;
                            cx2 += currentPointX;
                            cy2 += currentPointY;
                            x += currentPointX;
                            y += currentPointY;
                        }

                        graphics.cubicCurveTo(
                            cx1, cy1,
                            cx2, cy2,
                            x, y
                        );

                        currentPointX = x;
                        currentPointY = y;

                        lastControlX = 2 * x - cx2;
                        lastControlY = 2 * y - cy2;
                    }
                    break;

                case SVGCommandTypes.SMOOTH_CURVE_TO:
                    {
                        let cx = command.x2;
                        let cy = command.y2;
                        let x = command.x;
                        let y = command.y;
                        if (command.relative) {
                            cx += currentPointX;
                            cy += currentPointY;
                            x += currentPointX;
                            y += currentPointY;
                        }

                        graphics.cubicCurveTo(
                            lastControlX, lastControlY,
                            cx, cy,
                            x, y
                        );

                        currentPointX = x;
                        currentPointY = y;

                        lastControlX = 2 * x - cx;
                        lastControlY = 2 * y - cy;
                    }
                    break;

                case SVGCommandTypes.SMOOTH_QUAD_TO:
                    {
                        const radian = Math.atan2(
                            currentPointY - lastControlY,
                            currentPointX - lastControlX
                        );

                        const distance = Math.sqrt(
                            Math.pow(currentPointX - lastControlX, 2)
                            + Math.pow(currentPointY - lastControlY, 2)
                        );

                        lastControlX = currentPointX + distance * Math.cos(radian);
                        lastControlY = currentPointY + distance * Math.sin(radian);

                        if (command.relative) {
                            currentPointX += command.x;
                            currentPointY += command.y;
                        } else {
                            currentPointX = command.x;
                            currentPointY = command.y;
                        }

                        graphics.curveTo(
                            lastControlX,
                            lastControlY,
                            currentPointX,
                            currentPointY
                        );
                    }
                    break;

                case SVGCommandTypes.QUAD_TO:
                    {
                        let cx = command.x1;
                        let cy = command.y1;
                        let x = command.x;
                        let y = command.y;
                        if (command.relative) {
                            cx += currentPointX;
                            cy += currentPointY;
                            x += currentPointX;
                            y += currentPointY;
                        }

                        graphics.curveTo(
                            cx, cy,
                            x, y
                        );

                        currentPointX = x;
                        currentPointY = y;
                        lastControlX  = cx;
                        lastControlY  = cy;
                    }
                    break;

                case SVGCommandTypes.HORIZ_LINE_TO:
                    {
                        let x = command.x;
                        if (command.relative) {
                            x += currentPointX;
                        }

                        lastControlX = currentPointX = x;
                        graphics.lineTo(currentPointX, currentPointY);
                    }
                    break;

                case SVGCommandTypes.VERT_LINE_TO:
                    {
                        let y = command.y;
                        if (command.relative) {
                            y += currentPointY;
                        }

                        lastControlY = currentPointY = y;
                        graphics.lineTo(currentPointX, currentPointY);
                    }
                    break;

                case SVGCommandTypes.CLOSE_PATH:

                    if (graphics._$fills) {

                        const x = graphics._$fills[2];
                        const y = graphics._$fills[3];
                        if (x !== graphics._$pointerX || y !== graphics._$pointerY) {
                            graphics._$fills.push(Graphics.LINE_TO, x, y);
                        }

                        graphics.endFill();
                        graphics.beginFill(
                            fillObject.color,
                            fillObject.alpha
                        );
                    }

                    if (graphics._$lines) {

                        const x = graphics._$lines[2];
                        const y = graphics._$lines[3];
                        if (x !== graphics._$pointerX || y !== graphics._$pointerY) {
                            graphics._$lines.push(Graphics.LINE_TO, x, y);
                        }

                        graphics.endLine();
                        graphics.lineStyle(
                            strokeObject.width,
                            strokeObject.color,
                            strokeObject.alpha,
                            strokeObject.caps,
                            strokeObject.join
                        );
                    }

                    break;

                default:
                    break;

            }
        }
        graphics.endLine();
        graphics.endFill();

        let scale = 1;
        if (group_attribute_map.has("viewBox")) {

            const values = group_attribute_map
                .get("viewBox")
                .trim()
                .split(" ");

            const size = Math.max(values[2], values[3]);
            if (group_attribute_map.has("width")
                && group_attribute_map.has("height")
            ) {

                const baseWidth  = parseFloat(group_attribute_map.get("width"));
                const baseHeight = parseFloat(group_attribute_map.get("height"));

                const baseSize = Math.min(baseWidth, baseHeight);
                if (baseSize) {
                    scale = baseSize / size;
                }

                if (scale !== 1) {

                    let done = false;
                    for (let idx = 0; graphics._$recode.length > idx;) {

                        switch (graphics._$recode[idx++]) {

                            case Graphics.FILL_STYLE:
                            case Graphics.GRADIENT_FILL:
                            case Graphics.BITMAP_FILL:
                            case Graphics.STROKE_STYLE:
                            case Graphics.GRADIENT_STROKE:
                            case Graphics.BITMAP_STROKE:
                                done = true;
                                break;

                            case Graphics.BEGIN_PATH:
                                break;

                            case Graphics.LINE_TO:
                            case Graphics.MOVE_TO:
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                break;

                            case Graphics.CURVE_TO:
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                break;

                            case Graphics.CUBIC:
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                graphics._$recode[idx++] *= scale;
                                break;

                            default:
                                break;
                        }

                        if (done) {
                            break;
                        }
                    }

                    graphics._$xMin *= scale;
                    graphics._$xMax *= scale;
                    graphics._$yMin *= scale;
                    graphics._$yMax *= scale;
                }
            }
        }

        // adj matrix
        if (fillObject.gradient) {

            const gradient = fillObject.gradient;
            const matrix   = gradient.matrix;

            let width  = Math.abs(graphics._$xMax - graphics._$xMin);
            let height = Math.abs(graphics._$yMax - graphics._$yMin);
            if (gradient.gradientUnits === "userSpaceOnUse") {
                if (group_attribute_map.has("width")) {
                    width = parseFloat(group_attribute_map.get("width"));
                }
                if (group_attribute_map.has("height")) {
                    height = parseFloat(group_attribute_map.get("height"));
                }
            }

            if (gradient.type === "linear") {

                let array = [1, 0, 0, 1, 0, 0];
                if (element.hasAttribute("transform")) {

                    const transform = element.getAttribute("transform");

                    const transforms = transform.match(/\S+\(.*?\)/sg);
                    transforms.reverse();

                    for (let idx = 0; idx < transforms.length; ++idx) {
                        const transform = transforms[idx].split("(",2);
    
                        const command = transform[0];
                        const args = transform[1]
                            .replace(")", "")
                            .replace(/\s+/sg, ",")
                            .replace(/,{2,}/sg, ",")
                            .replace(/^,/, "")
                            .replace(/,$/, "")
                            .split(",");

                        switch (command) {

                            case "matrix":
                                break;
    
                            case "translate":
                                if (args.length === 1) {
                                    array = Util.$multiplicationMatrix(array, [1, 0, 0, 1, parseFloat(args[0]), 0]);
                                } else {
                                    array = Util.$multiplicationMatrix(array, [1, 0, 0, 1, parseFloat(args[0]), parseFloat(args[1])]);
                                }
                                break;
    
                            case "scale":
                                if (args.length === 1) {
                                    array = Util.$multiplicationMatrix(array, 
                                        [parseFloat(args[0]), 0, 0, 1, 0, 0]
                                    );
                                } else {
                                    array = Util.$multiplicationMatrix(array, 
                                        [parseFloat(args[0]), 0, 0, parseFloat(args[1]), 0, 0]
                                    );
                                }
                                break;
    
                            case "skewX":
                                {
                                    const skewX = parseFloat(args[0]) * (Math.PI / 180);
                                    array = Util.$multiplicationMatrix(array, [1, 0, Math.tan(skewX), 1, 0, 0]);
                                }
                                break;
    
                            case "skewY":
                                {
                                    const skewY = parseFloat(args[0]) * (Math.PI / 180);
                                    array = Util.$multiplicationMatrix(array, [1, Math.tan(skewY), 0, 1, 0, 0]);
                                }
                                break;
    
                            case "rotate":
                                {
                                    const angle = parseFloat(args[0]) * (Math.PI / 180);
                                    const cos = Math.cos(angle);
                                    const sin = Math.sin(angle);
                                    array = Util.$multiplicationMatrix(array, [cos, sin, -sin, cos, 0, 0]);
                                }
                                break;
                            
                            default:
                                break;
    
                        }
                    }
                }

                matrix.createGradientBox(
                    width, height,
                    Math.atan2(gradient.y2 - gradient.y1, gradient.x2 - gradient.x1),
                    gradient.x1 - array[4], gradient.y1 - array[5]
                );

            } else {

                const scale = Math.max(0, gradient.r) / width;
                const rx = width  * scale;
                const ry = height * scale;

                let array = [1, 0, 0, 1, rx, ry];
                if (element.hasAttribute("transform")) {

                    const transform = element.getAttribute("transform");

                    const transforms = transform.match(/\S+\(.*?\)/sg);
                    transforms.reverse();

                    for (let idx = 0; idx < transforms.length; ++idx) {
                        const transform = transforms[idx].split("(",2);
    
                        const command = transform[0];
                        const args = transform[1]
                            .replace(")", "")
                            .replace(/\s+/sg, ",")
                            .replace(/,{2,}/sg, ",")
                            .replace(/^,/, "")
                            .replace(/,$/, "")
                            .split(",");

                        switch (command) {

                            case "matrix":
                                break;
    
                            case "translate":
                                if (args.length === 1) {
                                    array = Util.$multiplicationMatrix(array, [1, 0, 0, 1, parseFloat(args[0]), 0]);
                                } else {
                                    array = Util.$multiplicationMatrix(array, [1, 0, 0, 1, parseFloat(args[0]), parseFloat(args[1])]);
                                }
                                break;
    
                            case "scale":
                                if (args.length === 1) {
                                    array = Util.$multiplicationMatrix(array, 
                                        [parseFloat(args[0]), 0, 0, 1, 0, 0]
                                    );
                                } else {
                                    array = Util.$multiplicationMatrix(array, 
                                        [parseFloat(args[0]), 0, 0, parseFloat(args[1]), 0, 0]
                                    );
                                }
                                break;
    
                            case "skewX":
                                {
                                    const skewX = parseFloat(args[0]) * (Math.PI / 180);
                                    array = Util.$multiplicationMatrix(array, [1, 0, Math.tan(skewX), 1, 0, 0]);
                                }
                                break;
    
                            case "skewY":
                                {
                                    const skewY = parseFloat(args[0]) * (Math.PI / 180);
                                    array = Util.$multiplicationMatrix(array, [1, Math.tan(skewY), 0, 1, 0, 0]);
                                }
                                break;
    
                            case "rotate":
                                {
                                    const angle = parseFloat(args[0]) * (Math.PI / 180);
                                    const cos = Math.cos(angle);
                                    const sin = Math.sin(angle);
                                    array = Util.$multiplicationMatrix(array, [cos, sin, -sin, cos, 0, 0]);
                                }
                                break;
                            
                            default:
                                break;
    
                        }
                    }
                }

                matrix.createGradientBox(
                    2 * rx, 2 * ry,
                    Math.atan2((gradient.fy - gradient.cy) / ry, (gradient.fx - gradient.cx) / rx),
                    gradient.cx - array[4], gradient.cy - array[5]
                );
                
            }

            if (gradient.gradientUnits !== "userSpaceOnUse") {
                matrix.translate(graphics._$xMin, graphics._$yMin);
            }

            if (gradient.transform) {

                const transforms = gradient.transform.match(/\S+\(.*?\)/sg);
                transforms.reverse();

                for (let idx = 0; idx < transforms.length; ++idx) {
                    const transform = transforms[idx].split("(",2);

                    const command = transform[0];
                    const args = transform[1]
                        .replace(")", "")
                        .replace(/\s+/sg, ",")
                        .replace(/,{2,}/sg, ",")
                        .replace(/^,/, "")
                        .replace(/,$/, "")
                        .split(",");
                    
                    switch (command) {

                        case "matrix":
                            break;

                        case "translate":
                            if (args.length === 1) {
                                matrix.translate(parseFloat(args[0]), 0);
                            } else {
                                matrix.translate(parseFloat(args[0]), parseFloat(args[1]));
                            }
                            break;

                        case "scale":
                            if (args.length === 1) {
                                matrix.scale(parseFloat(args[0]), 1);
                            } else {
                                matrix.scale(parseFloat(args[0]), parseFloat(args[1]));
                            }
                            break;

                        case "skewX":
                            {
                                const skewX = parseFloat(args[0]) * (Math.PI / 180);
                                matrix.a  = matrix.a + matrix.b * skewX;
                                matrix.c  = matrix.c + matrix.d * skewX;
                                matrix.tx = matrix.tx + matrix.ty * skewX;
                            }
                            break;

                        case "skewY":
                            {
                                const skewY = parseFloat(args[0]) * (Math.PI / 180);
                                matrix.b  = matrix.b + matrix.a * skewY;
                                matrix.d  = matrix.d + matrix.c * skewY;
                                matrix.ty = matrix.ty + matrix.tx * skewY;
                            }
                            break;

                        case "rotate":
                            matrix.rotate(parseFloat(args[0]) * Math.PI / 180);
                            break;
                        
                        default:
                            break;

                    }
                }
            }
        }

        if (graphics._$recode) {
            shape._$recodes = graphics._$recode.slice();
        }

        shape._$bounds = {
            "xMin": graphics._$xMin,
            "xMax": graphics._$xMax,
            "yMin": graphics._$yMin,
            "yMax": graphics._$yMax
        };
    }

    /**
     * @param  {array} param
     * @return {array}
     * @private
     */
    static _$adjParam (param)
    {
        for (;;) {
            let count = 0;
            for (let idx = 0; idx < param.length; ++idx) {

                const value = param[idx];
                if (!isNaN(value)) {
                    count++;
                    continue;
                }

                const values = value.split(".");
                param.splice(idx + 1, 0, `0.${values.pop()}`);
                param[idx] = values.join(".");
            }

            if (param.length === count) {
                break;
            }
        }
        return param;
    }

    /**
     * @param {next2d.display.Graphics} graphics
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {number} start_ang
     * @param {number} end_ang
     * @private
     * @static
     */
    static _$arc (graphics, x, y, radius, start_ang, end_ang)
    {
        let num = Math.min(Math.ceil(radius * 2 + 1), 1024);
        if (num < 1) {
            return;
        }

        start_ang = start_ang === undefined
            ? 0
            : start_ang;

        end_ang = end_ang === undefined
            ? Math.PI * 2
            : end_ang;

        const delta = (end_ang - start_ang) / num;
        for (let idx = 0; idx <= num; idx++) {
            const f = start_ang + idx * delta;
            graphics.lineTo(x + Math.cos(f) * radius, y + Math.sin(f) * radius);
        }
    }

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} fa
     * @param {number} fs
     * @param {number} rx
     * @param {number} ry
     * @param {number} phi
     * @private
     * @static
     */
    static _$arcToCurve (x1, y1, x2, y2, fa, fs, rx, ry, phi)
    {
        const TAU = Math.PI * 2;
        const sin_phi = Math.sin(phi * TAU / 360);
        const cos_phi = Math.cos(phi * TAU / 360);

        const x1p = cos_phi  * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
        const y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;

        if (x1p === 0 && y1p === 0 || rx === 0 || ry === 0) {
            return [];
        }

        rx = Math.abs(rx);
        ry = Math.abs(ry);

        const lambda = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        const cc = SVGToShape._$getArcCenter(
            x1, y1, x2, y2, fa, fs,
            rx, ry, sin_phi, cos_phi
        );

        const result = [];
        let theta1 = cc[2];
        let delta_theta = cc[3];

        const segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
        delta_theta /= segments;

        for (let idx = 0; idx < segments; idx++) {
            result.push(SVGToShape._$approximateUnitArc(theta1, delta_theta));
            theta1 += delta_theta;
        }

        return result.map((curve) =>
        {
            for (let idx = 0; idx < curve.length; idx += 2) {

                let x = curve[idx    ];
                let y = curve[idx + 1];

                // scale
                x *= rx;
                y *= ry;

                // rotate
                const xp = cos_phi * x - sin_phi * y;
                const yp = sin_phi * x + cos_phi * y;

                // translate
                curve[idx    ] = xp + cc[0];
                curve[idx + 1] = yp + cc[1];
            }

            curve.shift();
            curve.shift();

            return curve;
        });
    }

    /**
     * @param {number} theta1
     * @param {number} delta_theta
     * @return {array}
     * @private
     * @static
     */
    static _$approximateUnitArc (theta1, delta_theta)
    {
        const alpha = 4 / 3 * Math.tan(delta_theta / 4);

        const x1 = Math.cos(theta1);
        const y1 = Math.sin(theta1);
        const x2 = Math.cos(theta1 + delta_theta);
        const y2 = Math.sin(theta1 + delta_theta);

        return [
            x1, y1,
            x1 - y1 * alpha,
            y1 + x1 * alpha,
            x2 + y2 * alpha,
            y2 - x2 * alpha,
            x2, y2
        ];
    }

    /**
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} fa
     * @param {number} fs
     * @param {number} rx
     * @param {number} ry
     * @param {number} sin_phi
     * @param {number} cos_phi
     * @return {array}
     * @private
     * @static
     */
    static _$getArcCenter (x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi)
    {
        const TAU = Math.PI * 2;

        const x1p = cos_phi  * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
        const y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;

        const rx_sq  = rx * rx;
        const ry_sq  = ry * ry;
        const x1p_sq = x1p * x1p;
        const y1p_sq = y1p * y1p;

        let radicant = rx_sq * ry_sq - rx_sq * y1p_sq - ry_sq * x1p_sq;

        if (radicant < 0) {
            radicant = 0;
        }

        radicant /= rx_sq * y1p_sq + ry_sq * x1p_sq;
        radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

        const cxp = radicant *  rx / ry * y1p;
        const cyp = radicant * -ry / rx * x1p;

        const cx = cos_phi * cxp - sin_phi * cyp + (x1 + x2) / 2;
        const cy = sin_phi * cxp + cos_phi * cyp + (y1 + y2) / 2;

        const v1x = (x1p - cxp)  / rx;
        const v1y = (y1p - cyp)  / ry;
        const v2x = (-x1p - cxp) / rx;
        const v2y = (-y1p - cyp) / ry;

        const theta1 = SVGToShape._$unitVectorAngle(1, 0, v1x, v1y);
        let delta_theta = SVGToShape._$unitVectorAngle(v1x, v1y, v2x, v2y);

        if (fs === 0 && delta_theta > 0) {
            delta_theta -= TAU;
        }
        if (fs === 1 && delta_theta < 0) {
            delta_theta += TAU;
        }

        return [cx, cy, theta1, delta_theta];
    }

    /**
     * @param  {number} ux
     * @param  {number} uy
     * @param  {number} vx
     * @param  {number} vy
     * @return {number}
     * @static
     * @private
     */
    static _$unitVectorAngle (ux, uy, vx, vy)
    {
        const sign = ux * vy - uy * vx < 0 ? -1 : 1;
        let dot = ux * vx + uy * vy;

        if (dot > 1.0) {
            dot = 1.0;
        }

        if (dot < -1.0) {
            dot = -1.0;
        }

        return sign * Math.acos(dot);
    }
}
