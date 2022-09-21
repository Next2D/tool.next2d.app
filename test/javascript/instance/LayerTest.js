describe("Layer.js property test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("property default test", () =>
    {
        const layer = new Layer();
        expect(layer.id).toBe(0);
        expect(layer.name).toBe("");
        expect(layer.light).toBe(false);
        expect(layer.disable).toBe(false);
        expect(layer.lock).toBe(false);
        expect(layer.emptyCharacters.length).toBe(0);
        expect(layer.characters.length).toBe(0);
        expect(layer.totalFrame).toBe(0);
        expect(layer.maskId).toBe(null);
        expect(layer.guideId).toBe(null);
        expect(layer.mode).toBe(LayerMode.NORMAL);
    });

    it("property id test", () =>
    {
        const layer = new Layer();
        expect(layer.id).toBe(0);

        layer.id = 1;
        expect(layer.id).toBe(1);

        layer.id = -100;
        expect(layer.id).toBe(0);

        layer.id = 0xffffff;
        expect(layer.id).toBe(0xffff);
    });

    it("property name test", () =>
    {
        const layer = new Layer();
        expect(layer.name).toBe("");

        layer.name = "layer_1";
        expect(layer.name).toBe("layer_1");

        layer.name = 100;
        expect(layer.name).toBe("100");
    });

    it("property light test", () =>
    {
        const layer = new Layer();
        expect(layer.light).toBe(false);

        layer.light = true;
        expect(layer.light).toBe(true);

        layer.light = 0;
        expect(layer.light).toBe(false);
    });

    it("property disable test", () =>
    {
        const layer = new Layer();
        expect(layer.disable).toBe(false);

        layer.disable = true;
        expect(layer.disable).toBe(true);

        layer.disable = 0;
        expect(layer.disable).toBe(false);
    });

    it("property lock test", () =>
    {
        const layer = new Layer();
        expect(layer.lock).toBe(false);

        layer.lock = true;
        expect(layer.lock).toBe(true);

        layer.lock = 0;
        expect(layer.lock).toBe(false);
    });

    it("property totalFrame test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const layer = new Layer();
        expect(layer.totalFrame).toBe(0);

        expect(layer.characters.length).toBe(0);
        const character = new Character();
        character.startFrame = 5;
        character.endFrame = 10;
        layer.addCharacter(character);
        expect(layer.totalFrame).toBe(10);
        expect(layer.characters.length).toBe(1);

        expect(layer.emptyCharacters.length).toBe(0);
        const emptyCharacter = new EmptyCharacter({
            "startFrame": 10,
            "endFrame": 20
        });
        layer.addEmptyCharacter(emptyCharacter);
        expect(layer.totalFrame).toBe(20);
        expect(layer.emptyCharacters.length).toBe(1);

        Util.$workSpaces.length = 0;
    });

    it("property maskId test", () =>
    {
        const layer = new Layer();
        expect(layer.maskId).toBe(null);

        layer.maskId = 1;
        expect(layer.maskId).toBe(1);

        layer.maskId = -100;
        expect(layer.maskId).toBe(0);

        layer.maskId = 0xffffff;
        expect(layer.maskId).toBe(0xffff);

        layer.maskId = "null";
        expect(layer.maskId).toBe(null);

        layer.maskId = 1;
        expect(layer.maskId).toBe(1);

        layer.maskId = null;
        expect(layer.maskId).toBe(null);
    });

    it("property guideId test", () =>
    {
        const layer = new Layer();
        expect(layer.guideId).toBe(null);

        layer.guideId = 1;
        expect(layer.guideId).toBe(1);

        layer.guideId = -100;
        expect(layer.guideId).toBe(0);

        layer.guideId = 0xffffff;
        expect(layer.guideId).toBe(0xffff);

        layer.guideId = "null";
        expect(layer.guideId).toBe(null);

        layer.guideId = 1;
        expect(layer.guideId).toBe(1);

        layer.guideId = null;
        expect(layer.guideId).toBe(null);
    });

    it("property mode test", () =>
    {
        const layer = new Layer();
        expect(layer.mode).toBe(LayerMode.NORMAL);

        layer.mode = LayerMode.MASK;
        expect(layer.mode).toBe(LayerMode.MASK);

        layer.mode = LayerMode.MASK_IN;
        expect(layer.mode).toBe(LayerMode.MASK_IN);

        layer.mode = LayerMode.GUIDE;
        expect(layer.mode).toBe(LayerMode.GUIDE);

        layer.mode = LayerMode.GUIDE_IN;
        expect(layer.mode).toBe(LayerMode.GUIDE_IN);

        layer.mode = -1;
        expect(layer.mode).toBe(LayerMode.NORMAL);

        layer.mode = 100;
        expect(layer.mode).toBe(LayerMode.NORMAL);
    });
});

describe("Layer.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function getHighlightURL test", () =>
    {
        const layer = new Layer();
        layer.color = "#00ffff";
        expect(layer.getHighlightURL())
            .toBe("data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" viewBox=\"0 0 24 24\"><path fill=\"rgb(0,255,255)\" d=\"M14 19h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-1.989c-.003-1.858.87-3.389 1.721-4.867.761-1.325 1.482-2.577 1.482-3.932 0-2.592-2.075-3.772-4.003-3.772-1.925 0-3.997 1.18-3.997 3.772 0 1.355.721 2.607 1.482 3.932.851 1.478 1.725 3.009 1.72 4.867h-1.988c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772zm4-.691v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm-3.743 1.294l-1.04-1.94 1.208-.648 1.037 1.933c-.418.181-.822.401-1.205.655zm10.586 1.735l1.942-1.394.799 1.115-2.054 1.473c-.191-.43-.423-.827-.687-1.194zm-3.01-2.389l1.038-1.934 1.208.648-1.041 1.941c-.382-.254-.786-.473-1.205-.655zm-10.068 3.583l-2.054-1.472.799-1.115 1.942 1.393c-.264.366-.495.763-.687 1.194zm13.707 6.223l2.354.954-.514 1.271-2.425-.982c.21-.397.408-.812.585-1.243zm-13.108 1.155l-2.356 1.06-.562-1.251 2.34-1.052c.173.433.371.845.578 1.243zm-1.178-3.676h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681z\"/></svg>");
    });

    it("function sort test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character1 = new Character();
        character1.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const character2 = new Character();
        character2.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 1
        });

        const layer = new Layer();
        layer.addCharacter(character2);
        layer.addCharacter(character1);

        const characters = [character2, character1];
        expect(characters[0]).toBe(character2);
        expect(characters[1]).toBe(character1);

        // 並び替え
        layer.sort(characters, 1);

        expect(characters[0]).toBe(character1);
        expect(characters[1]).toBe(character2);

        Util.$workSpaces.length = 0;
    });

    it("function getActiveCharacter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character1 = new Character();
        character1.startFrame = 2;
        character1.endFrame   = 5;
        character1.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const character2 = new Character();
        character2.startFrame = 1;
        character2.endFrame   = 4;
        character2.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 1
        });
        character1.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 1
        });

        const layer = new Layer();
        layer.addCharacter(character2);
        layer.addCharacter(character1);

        const characters1 = layer.getActiveCharacter(1);
        expect(characters1.length).toBe(1);
        expect(characters1[0]).toBe(character2);

        const characters2 = layer.getActiveCharacter(3);
        expect(characters2.length).toBe(2);
        expect(characters2[0]).toBe(character2);
        expect(characters2[1]).toBe(character1);

        const characters3 = layer.getActiveCharacter(4);
        expect(characters3.length).toBe(1);
        expect(characters3[0]).toBe(character1);

        Util.$workSpaces.length = 0;
    });

    it("function getActiveCharacter test", () =>
    {
        const emptyCharacter1 = new EmptyCharacter({
            "startFrame": 1,
            "endFrame": 2
        });
        const emptyCharacter2 = new EmptyCharacter({
            "startFrame": 3,
            "endFrame": 10
        });

        const layer = new Layer();
        layer.addEmptyCharacter(emptyCharacter1);
        layer.addEmptyCharacter(emptyCharacter2);

        expect(layer.getActiveEmptyCharacter(1)).toBe(emptyCharacter1);
        expect(layer.getActiveEmptyCharacter(2)).toBe(null);
        expect(layer.getActiveEmptyCharacter(3)).toBe(emptyCharacter2);
        expect(layer.getActiveEmptyCharacter(9)).toBe(emptyCharacter2);
        expect(layer.getActiveEmptyCharacter(10)).toBe(null);
    });

    it("function getActiveCharacter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const root = workSpaces._$libraries.get(0);
        workSpaces.scene = root;

        const layer = new Layer();
        root.addLayer(layer);

        const layerNameElement = document
            .getElementById(`layer-name-${layer.id}`);

        const inputElement = document
            .getElementById(`layer-name-input-${layer.id}`);

        const elementIds = [
            `layer-icon-${layer.id}`,
            `layer-mask-icon-${layer.id}`,
            `layer-mask-in-icon-${layer.id}`,
            `layer-guide-icon-${layer.id}`,
            `layer-guide-in-icon-${layer.id}`,
            `timeline-exit-icon-${layer.id}`,
            `timeline-exit-in-icon-${layer.id}`
        ];

        layer.mode = LayerMode.NORMAL;
        layer.showIcon();

        expect(layerNameElement.classList.contains("in-view-text")).toBe(false);
        expect(layerNameElement.classList.contains("view-text")).toBe(true);
        expect(inputElement.classList.contains("in-view-text-input")).toBe(false);

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (id === `layer-icon-${layer.id}`) {
                expect(element.style.display).toBe("");
            } else {
                expect(element.style.display).toBe("none");
            }

        }

        layer.mode = LayerMode.MASK;
        layer.showIcon();

        expect(layerNameElement.classList.contains("in-view-text")).toBe(false);
        expect(layerNameElement.classList.contains("view-text")).toBe(true);
        expect(inputElement.classList.contains("in-view-text-input")).toBe(false);

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (id === `layer-mask-icon-${layer.id}`
                || id === `timeline-exit-icon-${layer.id}`
            ) {
                expect(element.style.display).toBe("");
            } else {
                expect(element.style.display).toBe("none");
            }

        }

        layer.mode = LayerMode.MASK_IN;
        layer.showIcon();

        expect(layerNameElement.classList.contains("in-view-text")).toBe(true);
        expect(layerNameElement.classList.contains("view-text")).toBe(false);
        expect(inputElement.classList.contains("in-view-text-input")).toBe(true);

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (id === `layer-mask-in-icon-${layer.id}`
                || id === `timeline-exit-in-icon-${layer.id}`
            ) {
                expect(element.style.display).toBe("");
            } else {
                expect(element.style.display).toBe("none");
            }

        }

        layer.mode = LayerMode.GUIDE;
        layer.showIcon();

        expect(layerNameElement.classList.contains("in-view-text")).toBe(false);
        expect(layerNameElement.classList.contains("view-text")).toBe(true);
        expect(inputElement.classList.contains("in-view-text-input")).toBe(false);

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (id === `layer-guide-icon-${layer.id}`
                || id === `timeline-exit-icon-${layer.id}`
            ) {
                expect(element.style.display).toBe("");
            } else {
                expect(element.style.display).toBe("none");
            }

        }

        layer.mode = LayerMode.GUIDE_IN;
        layer.showIcon();

        expect(layerNameElement.classList.contains("in-view-text")).toBe(true);
        expect(layerNameElement.classList.contains("view-text")).toBe(false);
        expect(inputElement.classList.contains("in-view-text-input")).toBe(true);

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (id === `layer-guide-in-icon-${layer.id}`
                || id === `timeline-exit-in-icon-${layer.id}`
            ) {
                expect(element.style.display).toBe("");
            } else {
                expect(element.style.display).toBe("none");
            }

        }

        Util.$workSpaces.length = 0;
    });
});
