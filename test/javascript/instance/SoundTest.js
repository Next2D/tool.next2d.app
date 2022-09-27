describe("Sound.js property test", () =>
{
    it("property test", () =>
    {
        const sound = new Sound({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 200,
            "height": 100
        });

        // mock
        window.next2d = {
            "media": {
                "Sound": {
                    "namespace": "next2d.media.Sound"
                }
            }
        };

        expect(sound.buffer).toBe("\x01\x01\x01\x01e\x01\x01n");
        expect(sound.volume).toBe(100);
        expect(sound.loopCount).toBe(0);
        expect(sound.defaultSymbol).toBe("next2d.media.Sound");
    });
});
