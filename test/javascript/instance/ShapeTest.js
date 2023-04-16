describe("Shape.js property test", () =>
{
    it("property test", () =>
    {
        const shape = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            }
        });

        // mock
        window.next2d = {
            "display": {
                "Shape": {
                    "namespace": "next2d.display.Shape"
                }
            }
        };

        // 初期値
        expect(shape.inBitmap).toBe(false);
        expect(shape.bitmapId).toBe(0);
        expect(shape.recodes.length).toBe(0);
        expect(shape.defaultSymbol).toBe("next2d.display.Shape");
        expect(shape.width).toBe(100);
        expect(shape.height).toBe(200);
        expect(shape.grid).toBe(null);
    });
});

describe("Shape.js showController test", () =>
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

        const shape = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            }
        });

        shape.showController({
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "loop": Util.$getDefaultLoopConfig()
        });
        expect(document.getElementById("sound-setting").style.display).toBe("none");
        expect(document.getElementById("ease-setting").style.display).toBe("none");
        expect(document.getElementById("text-setting").style.display).toBe("none");
        expect(document.getElementById("loop-setting").style.display).toBe("none");
        expect(document.getElementById("video-setting").style.display).toBe("none");
        expect(document.getElementById("fill-color-setting").style.display).toBe("none");
        expect(document.getElementById("nine-slice-setting").style.display).toBe("");
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

describe("Shape.js common function test", () =>
{
    it("function getBounds and bounds test", () =>
    {
        const shape = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            }
        });

        const bounds1 = shape.getBounds();

        expect(bounds1.xMin).toBe(0);
        expect(bounds1.xMax).toBe(100);
        expect(bounds1.yMin).toBe(0);
        expect(bounds1.yMax).toBe(200);

        const bounds2 = shape.getBounds([1.2, 0, 0.2, 1.9, 100, 200]);
        expect(bounds2.xMin).toBe(100);
        expect(bounds2.xMax).toBe(260);
        expect(bounds2.yMin).toBe(200);
        expect(bounds2.yMax).toBe(580);

        const bounds = shape.bounds;
        expect(bounds.xMin).toBe(0);
        expect(bounds.xMax).toBe(100);
        expect(bounds.yMin).toBe(0);
        expect(bounds.yMax).toBe(200);
    });

    it("function copyFrom test", () =>
    {
        const shape1 = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            },
            "recodes": [1,2,3,4]
        });

        const shape2 = new Shape({
            "id": 2,
            "name": "Shape_02",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 30,
                "yMin": 0,
                "yMax": 40
            },
            "recodes": [10,20,30,40]
        });

        expect(shape2.bounds.xMin).toBe(0);
        expect(shape2.bounds.xMax).toBe(30);
        expect(shape2.bounds.yMin).toBe(0);
        expect(shape2.bounds.yMax).toBe(40);
        expect(shape2.recodes[0]).toBe(10);
        expect(shape2.recodes[1]).toBe(20);
        expect(shape2.recodes[2]).toBe(30);
        expect(shape2.recodes[3]).toBe(40);

        shape1.copyFrom(shape2);
        expect(shape2.bounds.xMin).toBe(0);
        expect(shape2.bounds.xMax).toBe(100);
        expect(shape2.bounds.yMin).toBe(0);
        expect(shape2.bounds.yMax).toBe(200);
        expect(shape2.recodes[0]).toBe(1);
        expect(shape2.recodes[1]).toBe(2);
        expect(shape2.recodes[2]).toBe(3);
        expect(shape2.recodes[3]).toBe(4);
    });

    it("function toObject test", () =>
    {
        const shape = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "symbol": "app.shape",
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            },
            "recodes": [1,2,3,4]
        });

        const object = shape.toObject();
        expect(object.id).toBe(1);
        expect(object.name).toBe("Shape_01");
        expect(object.type).toBe(InstanceType.SHAPE);
        expect(object.symbol).toBe("app.shape");
        expect(object.folderId).toBe(0);
        expect(object.bitmapId).toBe(0);
        expect(object.grid).toBe(null);
        expect(object.inBitmap).toBe(false);
        expect(object.recodes[0]).toBe(1);
        expect(object.recodes[1]).toBe(2);
        expect(object.recodes[2]).toBe(3);
        expect(object.recodes[3]).toBe(4);
        expect(object.bounds.xMin).toBe(0);
        expect(object.bounds.xMax).toBe(100);
        expect(object.bounds.yMin).toBe(0);
        expect(object.bounds.yMax).toBe(200);
    });

    it("function toPublish test", () =>
    {
        const shape = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "symbol": "app.shape",
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            },
            "recodes": [1,2,3,4]
        });

        // mock
        window.next2d = {
            "display": {
                "Shape": {
                    "namespace": "next2d.display.Shape"
                }
            }
        };

        const object = shape.toPublish();
        expect(object.symbol).toBe("app.shape");
        expect(object.extends).toBe("next2d.display.Shape");
        expect(object.bitmapId).toBe(0);
        expect(object.grid).toBe(null);
        expect(object.inBitmap).toBe(false);
        expect(object.recodes[0]).toBe(1);
        expect(object.recodes[1]).toBe(2);
        expect(object.recodes[2]).toBe(3);
        expect(object.recodes[3]).toBe(4);
        expect(object.bounds.xMin).toBe(0);
        expect(object.bounds.xMax).toBe(100);
        expect(object.bounds.yMin).toBe(0);
        expect(object.bounds.yMax).toBe(200);
    });
});

describe("Shape.js createPointer test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function addPointer test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        workSpaces.scene = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        const shape = new Shape({
            "id": 33,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            }
        });

        Util.$clearShapePointer();
        shape.addPointer(
            0, 10, 0, 100, 50, 99
        );

        const element = document
            .getElementById("stage-area")
            .lastElementChild;

        expect(element.dataset.shapePointer).toBe("true");
        expect(element.dataset.layerId).toBe("0");
        expect(element.dataset.characterId).toBe("10");
        expect(element.dataset.index).toBe("0");
        expect(element.dataset.libraryId).toBe("33");
        expect(element.dataset.curve).toBe("false");
        expect(element.dataset.type).toBe("99");
        expect(element.dataset.position).toBe("17");

        Util.$workSpaces.length = 0;
    });
});
