describe("BaseController.js property test", () =>
{
    it("property test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const colorTransformController = new ColorTransformController();

        // 初期値
        expect(colorTransformController.name).toBe("color");
        expect(colorTransformController._$saved).toBe(false);
        expect(colorTransformController._$focus).toBe(false);
        expect(colorTransformController._$pointX).toBe(0);
        expect(colorTransformController._$pointY).toBe(0);
        expect(colorTransformController._$currentValue).toBe(null);
        expect(colorTransformController._$currentTarget).toBe(null);
        expect(colorTransformController._$lockTarget).toBe(null);
        expect(colorTransformController._$mouseMove).toBe(null);
        expect(colorTransformController._$mouseUp).toBe(null);
        expect(colorTransformController._$handler).toBe(null);

        Util.$workSpaces.length = 0;
    });

    it("MIN_OFFSET test", () =>
    {
        expect(ColorTransformController.MIN_OFFSET).toBe(-255);
    });

    it("MAX_OFFSET test", () =>
    {
        expect(ColorTransformController.MAX_OFFSET).toBe(255);
    });

    it("MIN_MULTIPLIER test", () =>
    {
        expect(ColorTransformController.MIN_MULTIPLIER).toBe(0);
    });

    it("MAX_MULTIPLIER test", () =>
    {
        expect(ColorTransformController.MAX_MULTIPLIER).toBe(100);
    });
});

describe("BaseController.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("Multiplier test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const colorTransformController = new ColorTransformController();

        const root = workSpaces._$libraries.get(0);
        workSpaces.scene = root;

        const character = new Character();
        character.startFrame = 1;
        character.endFrame = 10;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const layer = new Layer();
        layer.addCharacter(character);
        root.addLayer(layer);

        const div = document.createElement("div");
        div.id = `character-${character.id}`;
        div.dataset.characterId = `${character.id}`;
        div.dataset.layerId     = `${layer.id}`;
        div.dataset.child       = "true";

        document
            .getElementById("stage-area")
            .appendChild(div);

        const characterElement = document
            .getElementById(`character-${character.id}`);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.length = 0;
        tool.activeElements.push(characterElement);

        const place = character.getPlace(1);

        const functions = [
            "changeColorRedMultiplier",
            "changeColorGreenMultiplier",
            "changeColorBlueMultiplier",
            "changeColorAlphaMultiplier"
        ];

        for (let idx = 0; idx < functions.length; ++idx) {

            const name = functions[idx];

            // before
            expect(place.colorTransform[idx]).toBe(1);

            // execute
            colorTransformController[name](-100);
            expect(place.colorTransform[idx]).toBe(0);

            // execute
            colorTransformController[name](300);
            expect(place.colorTransform[idx]).toBe(1);

        }

        Util.$workSpaces.length = 0;
    });

    it("Offset test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const colorTransformController = new ColorTransformController();

        const root = workSpaces._$libraries.get(0);
        workSpaces.scene = root;

        const character = new Character();
        character.startFrame = 1;
        character.endFrame = 10;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const layer = new Layer();
        layer.addCharacter(character);
        root.addLayer(layer);

        const div = document.createElement("div");
        div.id = `character-${character.id}`;
        div.dataset.characterId = `${character.id}`;
        div.dataset.layerId     = `${layer.id}`;
        div.dataset.child       = "true";

        document
            .getElementById("stage-area")
            .appendChild(div);

        const characterElement = document
            .getElementById(`character-${character.id}`);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.length = 0;
        tool.activeElements.push(characterElement);

        const place = character.getPlace(1);

        const functions = [
            "changeColorRedOffset",
            "changeColorGreenOffset",
            "changeColorBlueOffset",
            "changeColorAlphaOffset"
        ];

        for (let idx = 0; idx < functions.length; ++idx) {

            const name = functions[idx];

            // before
            expect(place.colorTransform[idx + 4]).toBe(0);

            // execute
            colorTransformController[name](-300);
            expect(place.colorTransform[idx + 4]).toBe(-255);

            // execute
            colorTransformController[name](300);
            expect(place.colorTransform[idx + 4]).toBe(255);

        }

        Util.$workSpaces.length = 0;
    });

});
