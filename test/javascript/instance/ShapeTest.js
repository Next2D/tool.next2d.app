describe("MovieClip.js property test", () =>
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

        expect(shape.inBitmap).toBe(false);
        expect(shape.defaultSymbol).toBe("next2d.display.Shape");
        expect(shape.width).toBe(100);
        expect(shape.height).toBe(200);
    });
});
