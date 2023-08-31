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
        TextFieldClass.namespace = "next2d.display.TextField";

        window.next2d = {
            "display": {
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
        expect(textField.font).toBe("sans-serif");
        expect(textField.fontType).toBe(0);
        expect(textField.inputType).toBe("static");
        expect(textField.align).toBe("left");
        expect(textField.color).toBe(0);
        expect(textField.leading).toBe(0);
        expect(textField.letterSpacing).toBe(0);
        expect(textField.leftMargin).toBe(0);
        expect(textField.rightMargin).toBe(0);
        expect(textField.multiline).toBe(true);
        expect(textField.border).toBe(false);
        expect(textField.scroll).toBe(true);
        expect(textField.wordWrap).toBe(true);
        expect(textField.autoSize).toBe(0);
        expect(textField.thickness).toBe(0);
        expect(textField.thicknessColor).toBe(0);
        expect(textField.defaultSymbol).toBe("next2d.display.TextField");
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

describe("TextField.js function test", () =>
{
    it("function toObject test", () =>
    {
        // mock
        const TextFieldClass = function ()
        {
            this.defaultTextFormat = {};
        };
        TextFieldClass.namespace = "next2d.display.TextField";

        window.next2d = {
            "display": {
                "TextField": TextFieldClass
            }
        };

        const textField = new TextField({
            "id": 12,
            "name": "TextField_01",
            "type": InstanceType.TEXT,
            "symbol": "app.text",
            "text": "test"
        });

        const object = textField.toObject();
        expect(object.id).toBe(12);
        expect(object.name).toBe("TextField_01");
        expect(object.type).toBe(InstanceType.TEXT);
        expect(object.symbol).toBe("app.text");
        expect(object.folderId).toBe(0);
        expect(object.text).toBe("test");
        expect(object.font).toBe("sans-serif");
        expect(object.fontType).toBe(0);
        expect(object.inputType).toBe("static");
        expect(object.align).toBe("left");
        expect(object.color).toBe(0);
        expect(object.leading).toBe(0);
        expect(object.letterSpacing).toBe(0);
        expect(object.leftMargin).toBe(0);
        expect(object.rightMargin).toBe(0);
        expect(object.multiline).toBe(true);
        expect(object.border).toBe(false);
        expect(object.scroll).toBe(true);
        expect(object.wordWrap).toBe(true);
        expect(object.autoSize).toBe(0);
        expect(object.thickness).toBe(0);
        expect(object.thicknessColor).toBe(0);
    });

    it("function toPublish test", () =>
    {
        // mock
        const TextFieldClass = function ()
        {
            this.defaultTextFormat = {};
        };
        TextFieldClass.namespace = "next2d.display.TextField";

        window.next2d = {
            "display": {
                "TextField": TextFieldClass
            }
        };

        const textField = new TextField({
            "id": 12,
            "name": "TextField_01",
            "type": InstanceType.TEXT,
            "symbol": "app.text",
            "text": "test"
        });

        const object = textField.toPublish();
        expect(object.symbol).toBe("app.text");
        expect(object.extends).toBe("next2d.display.TextField");
        expect(object.text).toBe("test");
        expect(object.font).toBe("sans-serif");
        expect(object.fontType).toBe(0);
        expect(object.inputType).toBe("static");
        expect(object.align).toBe("left");
        expect(object.color).toBe(0);
        expect(object.leading).toBe(0);
        expect(object.letterSpacing).toBe(0);
        expect(object.leftMargin).toBe(0);
        expect(object.rightMargin).toBe(0);
        expect(object.multiline).toBe(true);
        expect(object.border).toBe(false);
        expect(object.scroll).toBe(true);
        expect(object.wordWrap).toBe(true);
        expect(object.autoSize).toBe(0);
        expect(object.thickness).toBe(0);
        expect(object.thicknessColor).toBe(0);
    });
});
