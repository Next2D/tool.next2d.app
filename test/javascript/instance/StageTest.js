describe("Stage.js property test", () =>
{
    it("STAGE_DEFAULT_WIDTH test", () =>
    {
        expect(Stage.STAGE_DEFAULT_WIDTH).toBe(550);
    });

    it("STAGE_DEFAULT_HEIGHT test", () =>
    {
        expect(Stage.STAGE_DEFAULT_HEIGHT).toBe(400);
    });

    it("STAGE_DEFAULT_FPS test", () =>
    {
        expect(Stage.STAGE_DEFAULT_FPS).toBe(24);
    });

    it("property test", () =>
    {
        const stage = new Stage();
        expect(stage.width).toBe(Stage.STAGE_DEFAULT_WIDTH);
        expect(stage.height).toBe(Stage.STAGE_DEFAULT_HEIGHT);
        expect(stage.fps).toBe(Stage.STAGE_DEFAULT_FPS);
        expect(stage.bgColor).toBe("#ffffff");
        expect(stage.lock).toBe(false);
    });
});

describe("Stage.js function test", () =>
{
    it("function toObject test", () =>
    {
        const stage = new Stage();

        const object = stage.toObject();
        expect(object.width).toBe(Stage.STAGE_DEFAULT_WIDTH);
        expect(object.height).toBe(Stage.STAGE_DEFAULT_HEIGHT);
        expect(object.fps).toBe(Stage.STAGE_DEFAULT_FPS);
        expect(object.bgColor).toBe("#ffffff");
        expect(object.lock).toBe(false);
    });
});

describe("Stage.js initialize test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function initialize test", () =>
    {
        const stage = new Stage();
        stage.initialize();

        const element = document.getElementById("stage");
        expect(element.style.width).toBe(`${stage.width}px`);
        expect(element.style.height).toBe(`${stage.height}px`);
        expect(element.style.backgroundColor).toBe("rgb(255, 255, 255)");
        expect(document.getElementById("library-preview-area").style.backgroundColor).toBe("rgb(255, 255, 255)");

        expect(document.getElementById("screen-scale").value).toBe("100");
        expect(document.getElementById("label-name").value).toBe("");
        expect(document.getElementById("stage-width").value).toBe(`${stage.width}`);
        expect(document.getElementById("stage-height").value).toBe(`${stage.height}`);
        expect(document.getElementById("stage-fps").value).toBe(`${stage.fps}`);
        expect(document.getElementById("stage-bgColor").value).toBe(stage.bgColor);
        expect(document.getElementById("stage-lock").childNodes[1].classList.contains("disable")).toBe(true);
        expect(document.getElementById("stage-lock").childNodes[1].classList.contains("active")).toBe(false);
        
        expect(Util.$offsetLeft).toBe(element.offsetLeft);
        expect(Util.$offsetTop).toBe(element.offsetTop);
    });
});
