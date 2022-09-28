describe("TextField.js property test", () =>
{
    it("FONT_DEFAULT_SIZE test", () =>
    {
        expect(TextField.FONT_DEFAULT_SIZE).toBe(200);
    });

    it("property test", () =>
    {
        // mock
        const TextFieldClass = function ()
        {
            this.defaultTextFormat = {};
        };
        TextFieldClass.namespace = "next2d.text.TextField";

        window.next2d = {
            "text": {
                "TextField": TextFieldClass
            }
        };

        const textField = new TextField({
            "id": 1,
            "name": "TextField_01",
            "type": InstanceType.TEXT,
            "text": "test"
        });

        expect(textField.text).toBe("test");
        expect(textField.defaultSymbol).toBe("next2d.text.TextField");
    });
});

describe("TextField.js showController test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function showController test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const textField = new TextField({
            "id": 1,
            "name": "TextField_01",
            "type": InstanceType.TEXT
        });

        textField.showController({
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        expect(document.getElementById("sound-setting").style.display).toBe("none");
        expect(document.getElementById("ease-setting").style.display).toBe("none");
        expect(document.getElementById("text-setting").style.display).toBe("");
        expect(document.getElementById("loop-setting").style.display).toBe("none");
        expect(document.getElementById("video-setting").style.display).toBe("none");
        expect(document.getElementById("fill-color-setting").style.display).toBe("none");
        expect(document.getElementById("nine-slice-setting").style.display).toBe("none");
        expect(document.getElementById("object-setting").style.display).toBe("");
        expect(document.getElementById("reference-setting").style.display).toBe("");
        expect(document.getElementById("transform-setting").style.display).toBe("");
        expect(document.getElementById("color-setting").style.display).toBe("");
        expect(document.getElementById("blend-setting").style.display).toBe("");
        expect(document.getElementById("filter-setting").style.display).toBe("");
        expect(document.getElementById("instance-setting").style.display).toBe("");

        Util.$workSpaces.length = 0;
    });
});
