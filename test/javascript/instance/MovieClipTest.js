describe("MovieClip.js property test", () =>
{
    it("property test", () =>
    {
        const movieClip = new MovieClip({
            "imageType": "image/png",
            "width": 200,
            "height": 100
        });

        // // mock
        // window.next2d = {
        //     "display": {
        //         "Shape": {
        //             "namespace": "next2d.display.Shape"
        //         }
        //     }
        // };
        //
        // expect(bitmap.width).toBe(200);
        // expect(bitmap.height).toBe(100);
        // expect(bitmap.imageType).toBe("image/png");
        // expect(bitmap.defaultSymbol).toBe("next2d.display.Shape");
    });
});
