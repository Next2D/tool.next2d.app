describe("FilterController.js property test", () =>
{
    it("default test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);

        Util.$workSpaces.length = 0;
    });

    it("MIN_BLUR test", () =>
    {
        expect(FilterController.MIN_BLUR).toBe(0);
    });

    it("MAX_BLUR test", () =>
    {
        expect(FilterController.MAX_BLUR).toBe(255);
    });

    it("MIN_ALPHA test", () =>
    {
        expect(FilterController.MIN_ALPHA).toBe(0);
    });

    it("MAX_ALPHA test", () =>
    {
        expect(FilterController.MAX_ALPHA).toBe(100);
    });

    it("MIN_STRENGTH test", () =>
    {
        expect(FilterController.MIN_STRENGTH).toBe(0);
    });

    it("MAX_STRENGTH test", () =>
    {
        expect(FilterController.MAX_STRENGTH).toBe(255);
    });

    it("MIN_ROTATE test", () =>
    {
        expect(FilterController.MIN_ROTATE).toBe(-360);
    });

    it("MAX_ROTATE test", () =>
    {
        expect(FilterController.MAX_ROTATE).toBe(360);
    });

    it("MIN_DISTANCE test", () =>
    {
        expect(FilterController.MIN_DISTANCE).toBe(-255);
    });

    it("MAX_DISTANCE test", () =>
    {
        expect(FilterController.MAX_DISTANCE).toBe(255);
    });

    it("MIN_COLOR test", () =>
    {
        expect(FilterController.MIN_COLOR).toBe(0);
    });

    it("MAX_COLOR test", () =>
    {
        expect(FilterController.MAX_COLOR).toBe(0xffffff);
    });

    it("MIN_QUALITY test", () =>
    {
        expect(FilterController.MIN_QUALITY).toBe(0);
    });

    it("MAX_QUALITY test", () =>
    {
        expect(FilterController.MAX_QUALITY).toBe(16);
    });
});

describe("FilterController.js function with html test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("addBevelFilter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = workSpaces._$libraries.get(0);
        workSpaces.scene = movieClip;

        const layer = movieClip._$layers.values().next().value;

        const character = new Character();
        character.setPlace(1, {
            "filter": []
        });
        layer.addCharacter(character);

        const element = document.getElementById("filter-setting-list");

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.push({
            "dataset": {
                "layerId": layer.id,
                "characterId": character.id
            }
        });

        Util.$timelineFrame.currentFrame = 1;
        filterController.addBevelFilter();
        expect(filterController._$filterId).toBe(1);
        expect(filterController._$filters.size).toBe(1);
        expect(element.children.length).toBe(2);
        expect(document.getElementById("filter-name-0").textContent).toBe("Bevel");

        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("addBlurFilter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = workSpaces._$libraries.get(0);
        workSpaces.scene = movieClip;

        const layer = movieClip._$layers.values().next().value;

        const character = new Character();
        character.setPlace(1, {
            "filter": []
        });
        layer.addCharacter(character);

        const element = document.getElementById("filter-setting-list");

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.push({
            "dataset": {
                "layerId": layer.id,
                "characterId": character.id
            }
        });

        Util.$timelineFrame.currentFrame = 1;
        filterController.addBlurFilter();
        expect(filterController._$filterId).toBe(1);
        expect(filterController._$filters.size).toBe(1);
        expect(element.children.length).toBe(2);
        expect(document.getElementById("filter-name-0").textContent).toBe("Blur");

        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("addDropShadowFilter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = workSpaces._$libraries.get(0);
        workSpaces.scene = movieClip;

        const layer = movieClip._$layers.values().next().value;

        const character = new Character();
        character.setPlace(1, {
            "filter": []
        });
        layer.addCharacter(character);

        const element = document.getElementById("filter-setting-list");

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.push({
            "dataset": {
                "layerId": layer.id,
                "characterId": character.id
            }
        });

        Util.$timelineFrame.currentFrame = 1;
        filterController.addDropShadowFilter();
        expect(filterController._$filterId).toBe(1);
        expect(filterController._$filters.size).toBe(1);
        expect(element.children.length).toBe(2);
        expect(document.getElementById("filter-name-0").textContent).toBe("DropShadow");

        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("addGlowFilter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = workSpaces._$libraries.get(0);
        workSpaces.scene = movieClip;

        const layer = movieClip._$layers.values().next().value;

        const character = new Character();
        character.setPlace(1, {
            "filter": []
        });
        layer.addCharacter(character);

        const element = document.getElementById("filter-setting-list");

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.push({
            "dataset": {
                "layerId": layer.id,
                "characterId": character.id
            }
        });

        Util.$timelineFrame.currentFrame = 1;
        filterController.addGlowFilter();
        expect(filterController._$filterId).toBe(1);
        expect(filterController._$filters.size).toBe(1);
        expect(element.children.length).toBe(2);
        expect(document.getElementById("filter-name-0").textContent).toBe("Glow");

        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("addFilter test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = workSpaces._$libraries.get(0);
        workSpaces.scene = movieClip;

        const layer = movieClip._$layers.values().next().value;

        const character = new Character();
        character.setPlace(1, {
            "filter": []
        });
        layer.addCharacter(character);

        const element = document.getElementById("filter-setting-list");

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.activeElements.push({
            "dataset": {
                "layerId": layer.id,
                "characterId": character.id
            }
        });

        Util.$timelineFrame.currentFrame = 1;
        filterController.addFilter();
        expect(filterController._$filterId).toBe(1);
        expect(filterController._$filters.size).toBe(1);
        expect(element.children.length).toBe(2);
        expect(document.querySelectorAll(".filter-none")[0].style.display).toBe("none");
        expect(document.getElementById("filter-name-0").textContent).toBe("DropShadow");

        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });
});

describe("FilterController.js function test", () =>
{
    it("changeAlpha test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "alpha": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.alpha).toBe(0);
        expect(filterController.changeAlpha(10)).toBe(10);
        expect(object.filter.alpha).toBe(10);
        expect(filterController.changeAlpha(-10)).toBe(FilterController.MIN_ALPHA);
        expect(object.filter.alpha).toBe(FilterController.MIN_ALPHA);
        expect(filterController.changeAlpha(255)).toBe(FilterController.MAX_ALPHA);
        expect(object.filter.alpha).toBe(FilterController.MAX_ALPHA);

        Util.$workSpaces.length = 0;
    });

    it("changeAngle test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "angle": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.angle).toBe(0);
        expect(filterController.changeAngle(45)).toBe(45);
        expect(object.filter.angle).toBe(45);
        expect(filterController.changeAngle(-999)).toBe(81);
        expect(object.filter.angle).toBe(81);
        expect(filterController.changeAngle(999)).toBe(279);
        expect(object.filter.angle).toBe(279);

        Util.$workSpaces.length = 0;
    });

    it("changeBlurX test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "blurX": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.blurX).toBe(0);
        expect(filterController.changeBlurX(10)).toBe(10);
        expect(object.filter.blurX).toBe(10);
        expect(filterController.changeBlurX(-999)).toBe(FilterController.MIN_BLUR);
        expect(object.filter.blurX).toBe(FilterController.MIN_BLUR);
        expect(filterController.changeBlurX(999)).toBe(FilterController.MAX_BLUR);
        expect(object.filter.blurX).toBe(FilterController.MAX_BLUR);

        Util.$workSpaces.length = 0;
    });

    it("changeBlurY test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "blurY": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.blurY).toBe(0);
        expect(filterController.changeBlurY(10)).toBe(10);
        expect(object.filter.blurY).toBe(10);
        expect(filterController.changeBlurY(-999)).toBe(FilterController.MIN_BLUR);
        expect(object.filter.blurY).toBe(FilterController.MIN_BLUR);
        expect(filterController.changeBlurY(999)).toBe(FilterController.MAX_BLUR);
        expect(object.filter.blurY).toBe(FilterController.MAX_BLUR);

        Util.$workSpaces.length = 0;
    });

    it("changeColor test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "color": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.color).toBe(0);
        expect(filterController.changeColor("#ffffff")).toBe("#ffffff");
        expect(object.filter.color).toBe(0xffffff);
        expect(filterController.changeColor("#ff00ff")).toBe("#ff00ff");
        expect(object.filter.color).toBe(0xff00ff);

        Util.$workSpaces.length = 0;
    });

    it("changeDistance test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "distance": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.distance).toBe(0);
        expect(filterController.changeDistance(10)).toBe(10);
        expect(object.filter.distance).toBe(10);
        expect(filterController.changeDistance(-999)).toBe(FilterController.MIN_DISTANCE);
        expect(object.filter.distance).toBe(FilterController.MIN_DISTANCE);
        expect(filterController.changeDistance(999)).toBe(FilterController.MAX_DISTANCE);
        expect(object.filter.distance).toBe(FilterController.MAX_DISTANCE);

        Util.$workSpaces.length = 0;
    });
});
