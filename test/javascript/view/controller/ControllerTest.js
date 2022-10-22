describe("Controller.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("default test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const controller = new Controller();
        controller.default();

        // 表示
        expect(document.getElementById("object-area").style.display).toBe("none");
        expect(document.getElementById("instance-setting").style.display).toBe("none");
        expect(document.getElementById("fill-color-setting").style.display).toBe("none");

        // 非表示
        expect(document.getElementById("stage-setting").style.display).toBe("");
        expect(document.getElementById("sound-setting").style.display).toBe("");
        expect(document.getElementById("object-setting").style.display).toBe("");
        expect(document.getElementById("color-setting").style.display).toBe("");
        expect(document.getElementById("blend-setting").style.display).toBe("");
        expect(document.getElementById("filter-setting").style.display).toBe("");

        Util.$workSpaces.length = 0;
    });

    it("showObjectSetting test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const controller = new Controller();
        controller.default();

        // 表示
        expect(document.getElementById("object-area").style.display).toBe("none");
        expect(document.getElementById("instance-setting").style.display).toBe("none");
        expect(document.getElementById("fill-color-setting").style.display).toBe("none");

        controller.showObjectSetting([
            "object-area",
            "instance-setting",
            "fill-color-setting"
        ]);

        // 非表示
        expect(document.getElementById("object-area").style.display).toBe("");
        expect(document.getElementById("instance-setting").style.display).toBe("");
        expect(document.getElementById("fill-color-setting").style.display).toBe("");

        Util.$workSpaces.length = 0;
    });

    it("hideObjectSetting test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const controller = new Controller();
        controller.default();

        // 非表示
        expect(document.getElementById("stage-setting").style.display).toBe("");
        expect(document.getElementById("sound-setting").style.display).toBe("");
        expect(document.getElementById("object-setting").style.display).toBe("");
        expect(document.getElementById("color-setting").style.display).toBe("");
        expect(document.getElementById("blend-setting").style.display).toBe("");
        expect(document.getElementById("filter-setting").style.display).toBe("");

        controller.hideObjectSetting([
            "stage-setting",
            "sound-setting",
            "object-setting",
            "color-setting",
            "blend-setting",
            "filter-setting"
        ]);

        // 表示
        expect(document.getElementById("stage-setting").style.display).toBe("none");
        expect(document.getElementById("sound-setting").style.display).toBe("none");
        expect(document.getElementById("object-setting").style.display).toBe("none");
        expect(document.getElementById("color-setting").style.display).toBe("none");
        expect(document.getElementById("blend-setting").style.display).toBe("none");
        expect(document.getElementById("filter-setting").style.display).toBe("none");

        Util.$workSpaces.length = 0;
    });
});
