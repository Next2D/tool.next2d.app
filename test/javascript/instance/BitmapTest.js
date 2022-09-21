describe("Bitmap.js property test", () =>
{
    it("property test", () =>
    {
        const bitmap = new Bitmap({
            "imageType": "image/png",
            "width": 200,
            "height": 100
        });

        // mock
        window.next2d = {
            "display": {
                "Shape": {
                    "namespace": "next2d.display.Shape"
                }
            }
        };

        expect(bitmap.width).toBe(200);
        expect(bitmap.height).toBe(100);
        expect(bitmap.imageType).toBe("image/png");
        expect(bitmap.defaultSymbol).toBe("next2d.display.Shape");
    });
});

describe("Bitmap.js function test", () =>
{
    it("function getBounds test", () =>
    {
        const bitmap = new Bitmap({
            "width": 200,
            "height": 100
        });

        const bounds1 = bitmap.getBounds();
        expect(bounds1.xMax).toBe(200);
        expect(bounds1.yMax).toBe(100);

        const bounds2 = bitmap.getBounds([1.2, 0, 0, 1.5, 0, 0]);
        expect(bounds2.xMax).toBe(240);
        expect(bounds2.yMax).toBe(150);
    });

    it("function toObject test", () =>
    {
        const bitmap = new Bitmap({
            "id": 1,
            "name": "image",
            "type": InstanceType.BITMAP,
            "symbol": "app.bitmap",
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "buffer": new Uint8Array([
                1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1
            ])
        });

        const object = bitmap.toObject();
        expect(object.id).toBe(1);
        expect(object.name).toBe("image");
        expect(object.type).toBe(InstanceType.BITMAP);
        expect(object.symbol).toBe("app.bitmap");
        expect(object.imageType).toBe("image/png");
        expect(object.width).toBe(200);
        expect(object.height).toBe(100);
        expect(object.buffer).toBe("\x01\x02\x03\x04\x05\x06\x07\b\t\b\x07\x06\x05\x04\x03\x02\x01");
    });

    it("function toPublish test", () =>
    {
        const bitmap = new Bitmap({
            "id": 1,
            "name": "image",
            "type": InstanceType.BITMAP,
            "symbol": "app.bitmap",
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "buffer": new Uint8Array([
                1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1
            ])
        });

        // mock
        window.next2d = {
            "display": {
                "Shape": {
                    "namespace": "next2d.display.Shape"
                }
            }
        };

        const object = bitmap.toPublish();
        expect(object.extends).toBe("next2d.display.Shape");
        expect(object.symbol).toBe("app.bitmap");
        for (let idx = 0; idx < 9; ++idx) {
            expect(object.buffer[idx]).toBe(idx + 1);
        }
        expect(object.bounds.xMin).toBe(0);
        expect(object.bounds.xMax).toBe(200);
        expect(object.bounds.yMin).toBe(0);
        expect(object.bounds.yMax).toBe(100);
    });

});
