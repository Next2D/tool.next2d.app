describe("Video.js property test", () =>
{
    it("property test", () =>
    {
        const video = new Video({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        // mock
        window.next2d = {
            "media": {
                "Video": {
                    "namespace": "next2d.media.Video"
                }
            }
        };

        expect(video.buffer).toBe("\x01\x01\x01\x01e\x01\x01n");
        expect(video.volume).toBe(100);
        expect(video.loop).toBe(false);
        expect(video.autoPlay).toBe(true);
        expect(video.defaultSymbol).toBe("next2d.media.Video");
    });
});
