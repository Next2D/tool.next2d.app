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

        filterController.clear();
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

        filterController.clear();
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

        filterController.clear();
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

        filterController.clear();
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

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("changeState test", () =>
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

        const object = filterController._$filters.get(0);
        expect(object.filter.state).toBe(true);

        const stateElement = document.getElementById("filter-state-0");
        expect(stateElement.classList.contains("filter-active")).toBe(true);
        expect(stateElement.classList.contains("filter-disable")).toBe(false);

        filterController.changeState({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });

        expect(object.filter.state).toBe(false);
        expect(stateElement.classList.contains("filter-active")).toBe(false);
        expect(stateElement.classList.contains("filter-disable")).toBe(true);

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("clear test", () =>
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

        filterController.clear();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);
        expect(document.querySelectorAll(".filter-none")[0].style.display).toBe("");

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("clickNodeTitle test", () =>
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

        const viewElement = document
            .getElementById("filter-view-area-0");

        const titleElement = document
            .getElementById("filter-title-arrow-0");

        expect(viewElement.style.display).toBe("");
        expect(titleElement.classList.contains("arrow")).toBe(true);
        expect(titleElement.classList.contains("active")).toBe(true);
        expect(titleElement.classList.contains("disable")).toBe(false);

        filterController.clickNodeTitle({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });

        expect(viewElement.style.display).toBe("none");
        expect(titleElement.classList.contains("arrow")).toBe(true);
        expect(titleElement.classList.contains("active")).toBe(false);
        expect(titleElement.classList.contains("disable")).toBe(true);

        filterController.clickNodeTitle({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });

        expect(viewElement.style.display).toBe("");
        expect(titleElement.classList.contains("arrow")).toBe(true);
        expect(titleElement.classList.contains("active")).toBe(true);
        expect(titleElement.classList.contains("disable")).toBe(false);

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("lock test", () =>
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

        filterController.addFilter();
        expect(filterController._$filterId).toBe(1);
        expect(filterController._$filters.size).toBe(1);
        expect(element.children.length).toBe(2);
        expect(document.querySelectorAll(".filter-none")[0].style.display).toBe("none");

        const parentElement = document.getElementById("filter-0-lock");
        const iconElement = parentElement.childNodes[1];
        expect(iconElement.classList.contains("active")).toBe(false);
        expect(iconElement.classList.contains("disable")).toBe(true);

        filterController.lock({
            "preventDefault": () => { return true },
            "stopPropagation": () => { return true },
            "currentTarget": parentElement
        });
        expect(iconElement.classList.contains("active")).toBe(true);
        expect(iconElement.classList.contains("disable")).toBe(false);

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("removeFilter test", () =>
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

        filterController.removeFilter({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });
        expect(filterController._$filters.size).toBe(0);
        expect(element.children.length).toBe(1);
        expect(document.querySelectorAll(".filter-none")[0].style.display).toBe("");

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

    it("setLockElement test", () =>
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

        filterController._$filters.get(0).lock = true;

        filterController._$currentTarget = {
            "dataset": {
                "name": "blurX"
            }
        };
        expect(filterController._$lockTarget).toBe(null);
        filterController.setLockElement({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });
        expect(filterController._$lockTarget)
            .toBe(document.getElementById("blurY-0"));

        filterController._$currentTarget = {
            "dataset": {
                "name": "blurY"
            }
        };
        filterController.setLockElement({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });
        expect(filterController._$lockTarget)
            .toBe(document.getElementById("blurX-0"));

        filterController._$currentTarget = {
            "dataset": {
                "name": "color"
            }
        };
        filterController.setLockElement({
            "target": {
                "dataset": {
                    "filterId": 0
                }
            }
        });
        expect(filterController._$lockTarget).toBe(null);

        filterController.clear();
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

    it("changeHideObject test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "hideObject": false
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.hideObject).toBe(false);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": true
        };
        filterController.changeHideObject();
        expect(object.filter.hideObject).toBe(true);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": ""
        };
        filterController.changeHideObject();
        expect(object.filter.hideObject).toBe(false);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": "abc"
        };
        filterController.changeHideObject();
        expect(object.filter.hideObject).toBe(true);

        Util.$workSpaces.length = 0;
    });

    it("changeHighlightAlpha test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "highlightAlpha": 100
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.highlightAlpha).toBe(100);
        expect(filterController.changeHighlightAlpha(10)).toBe(10);
        expect(object.filter.highlightAlpha).toBe(10);
        expect(filterController.changeHighlightAlpha(-999)).toBe(FilterController.MIN_ALPHA);
        expect(object.filter.highlightAlpha).toBe(FilterController.MIN_ALPHA);
        expect(filterController.changeHighlightAlpha(999)).toBe(FilterController.MAX_ALPHA);
        expect(object.filter.highlightAlpha).toBe(FilterController.MAX_ALPHA);

        Util.$workSpaces.length = 0;
    });

    it("changeHighlightColor test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "highlightColor": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.highlightColor).toBe(0);
        expect(filterController.changeHighlightColor("#ffffff")).toBe("#ffffff");
        expect(object.filter.highlightColor).toBe(0xffffff);
        expect(filterController.changeHighlightColor("#ff00ff")).toBe("#ff00ff");
        expect(object.filter.highlightColor).toBe(0xff00ff);

        Util.$workSpaces.length = 0;
    });

    it("changeInner test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "inner": false
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.inner).toBe(false);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": true
        };
        filterController.changeInner();
        expect(object.filter.inner).toBe(true);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": ""
        };
        filterController.changeInner();
        expect(object.filter.inner).toBe(false);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": "abc"
        };
        filterController.changeInner();
        expect(object.filter.inner).toBe(true);

        Util.$workSpaces.length = 0;
    });

    it("changeKnockout test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "knockout": false
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.knockout).toBe(false);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": true
        };
        filterController.changeKnockout();
        expect(object.filter.knockout).toBe(true);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": ""
        };
        filterController.changeKnockout();
        expect(object.filter.knockout).toBe(false);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            },
            "checked": "abc"
        };
        filterController.changeKnockout();
        expect(object.filter.knockout).toBe(true);

        Util.$workSpaces.length = 0;
    });

    it("changeQuality test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "quality": 1
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.quality).toBe(1);
        filterController.changeQuality(10);
        expect(object.filter.quality).toBe(10);
        filterController.changeQuality(-999);
        expect(object.filter.quality).toBe(FilterController.MIN_QUALITY);
        filterController.changeQuality(999);
        expect(object.filter.quality).toBe(FilterController.MAX_QUALITY);

        Util.$workSpaces.length = 0;
    });

    it("changeShadowAlpha test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "shadowAlpha": 100
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.shadowAlpha).toBe(100);
        expect(filterController.changeShadowAlpha(10)).toBe(10);
        expect(object.filter.shadowAlpha).toBe(10);
        expect(filterController.changeShadowAlpha(-999)).toBe(FilterController.MIN_ALPHA);
        expect(object.filter.shadowAlpha).toBe(FilterController.MIN_ALPHA);
        expect(filterController.changeShadowAlpha(999)).toBe(FilterController.MAX_ALPHA);
        expect(object.filter.shadowAlpha).toBe(FilterController.MAX_ALPHA);

        Util.$workSpaces.length = 0;
    });

    it("changeShadowColor test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "shadowColor": 0
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.shadowColor).toBe(0);
        expect(filterController.changeShadowColor("#ffffff")).toBe("#ffffff");
        expect(object.filter.shadowColor).toBe(0xffffff);
        expect(filterController.changeShadowColor("#ff00ff")).toBe("#ff00ff");
        expect(object.filter.shadowColor).toBe(0xff00ff);

        Util.$workSpaces.length = 0;
    });

    it("changeStrength test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "strength": 1
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.strength).toBe(1);
        expect(filterController.changeStrength(10)).toBe(10);
        expect(object.filter.strength).toBe(10);
        expect(filterController.changeStrength(-999)).toBe(FilterController.MIN_STRENGTH);
        expect(object.filter.strength).toBe(FilterController.MIN_STRENGTH);
        expect(filterController.changeStrength(999)).toBe(FilterController.MAX_STRENGTH);
        expect(object.filter.strength).toBe(FilterController.MAX_STRENGTH);

        Util.$workSpaces.length = 0;
    });

    it("changeType test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();

        const object = {
            "filter": {
                "type": "inner"
            }
        };
        filterController._$filters.set(1, object);

        filterController._$currentTarget = {
            "dataset": {
                "filterId": 1
            }
        };

        expect(object.filter.type).toBe("inner");
        filterController.changeType("outer");
        expect(object.filter.type).toBe("outer");
        filterController.changeType("full");
        expect(object.filter.type).toBe("full");
        filterController.changeType("abc");
        expect(object.filter.type).toBe("full");

        Util.$workSpaces.length = 0;
    });

    it("createFilter test", () =>
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

        const filterController = new FilterController();
        expect(filterController._$filters.size).toBe(0);

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

        const object1 = filterController._$filters.get(filterController.createFilter(BevelFilter));
        expect(object1.filter.constructor).toBe(BevelFilter);
        const object2 = filterController._$filters.get(filterController.createFilter(BlurFilter));
        expect(object2.filter.constructor).toBe(BlurFilter);
        const object3 = filterController._$filters.get(filterController.createFilter(DropShadowFilter));
        expect(object3.filter.constructor).toBe(DropShadowFilter);
        const object4 = filterController._$filters.get(filterController.createFilter(GlowFilter));
        expect(object4.filter.constructor).toBe(GlowFilter);
        const object5 = filterController._$filters.get(filterController.createFilter(GradientBevelFilter));
        expect(object5.filter.constructor).toBe(GradientBevelFilter);
        const object6 = filterController._$filters.get(filterController.createFilter(GradientGlowFilter));
        expect(object6.filter.constructor).toBe(GradientGlowFilter);

        filterController.clear();
        tool.activeElements.length = 0;
        Util.$workSpaces.length = 0;
    });

});
