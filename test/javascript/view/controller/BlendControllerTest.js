describe("BaseController.js property test", () =>
{
    it("property test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const blendController = new BlendController();

        // 初期値
        expect(blendController.name).toBe("blend");
        expect(blendController._$saved).toBe(false);
        expect(blendController._$focus).toBe(false);
        expect(blendController._$pointX).toBe(0);
        expect(blendController._$pointY).toBe(0);
        expect(blendController._$currentValue).toBe(null);
        expect(blendController._$currentTarget).toBe(null);
        expect(blendController._$lockTarget).toBe(null);
        expect(blendController._$mouseMove).toBe(null);
        expect(blendController._$mouseUp).toBe(null);
        expect(blendController._$handler).toBe(null);

        Util.$workSpaces.length = 0;
    });
});

describe("BaseController.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("changeBlendSelect test case1", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);
        const blendController = new BlendController();

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

        // before
        expect(place.blendMode).toBe("normal");

        // execute
        blendController.changeBlendSelect("multiply");

        // after
        expect(place.blendMode).toBe("multiply");

        Util.$workSpaces.length = 0;
    });

    it("changeBlendSelect test case tween", () =>
    {
        const workSpaces = new WorkSpace();

        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);
        const blendController = new BlendController();

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
        character.setTween(character.startFrame, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": character.startFrame,
            "endFrame": character.endFrame
        });

        character.updateTweenPlace(
            character.startFrame, character.endFrame
        );

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

        const frame = 5;
        Util.$timelineFrame.currentFrame = frame;
        Util.$timelineLayer.targetFrames.clear();
        Util.$timelineLayer.targetFrames.set(
            layer.id, [frame]
        );

        // before
        for (let idx = 1; idx < 10; ++idx) {
            const place = character.getPlace(frame);
            expect(place.blendMode).toBe("normal");
        }

        // execute
        blendController.changeBlendSelect("multiply");

        // after
        for (let idx = 1; idx < 5; ++idx) {
            const place = character.getPlace(idx);
            expect(place.blendMode).toBe("normal");
        }
        for (let idx = 5; idx < 10; ++idx) {
            const place = character.getPlace(idx);
            expect(place.blendMode).toBe("multiply");
        }

        Util.$workSpaces.length = 0;
    });
});
