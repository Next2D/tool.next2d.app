import { execute } from "./MovieClipCreatePublishPlaceObjectService";
import { describe, expect, it } from "vitest";

describe("MovieClipCreatePublishPlaceObjectServiceTest", () =>
{
    it("execute test case1", () =>
    {
        const object = execute({
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "filters": [],
            "blendMode": "normal"
        });
        expect("matrix" in object).toBe(false);
        expect("colorTransform" in object).toBe(false);
        expect("surfaceFilterList" in object).toBe(false);
        expect("blendMode" in object).toBe(false);
    });

    it("execute test case2", () =>
    {
        const object = execute({
            "matrix": [1, 0, 0, 1, 10, 10],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "filters": [],
            "blendMode": "normal"
        });
        expect("matrix" in object).toBe(true);
        expect("colorTransform" in object).toBe(false);
        expect("surfaceFilterList" in object).toBe(false);
        expect("blendMode" in object).toBe(false);
    });

    it("execute test case3", () =>
    {
        const object = execute({
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [2, 1, 1, 1, 0, 0, 0, 0],
            "filters": [],
            "blendMode": "normal"
        });
        expect("matrix" in object).toBe(false);
        expect("colorTransform" in object).toBe(true);
        expect("surfaceFilterList" in object).toBe(false);
        expect("blendMode" in object).toBe(false);
    });

    it("execute test case4", () =>
    {
        const object = execute({
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "filters": [{
                "name": "filter",
                "state": true,
                "toParamArray": () => []
            }],
            "blendMode": "normal"
        });
        expect("matrix" in object).toBe(false);
        expect("colorTransform" in object).toBe(false);
        expect("surfaceFilterList" in object).toBe(true);
        expect("blendMode" in object).toBe(false);
    });

    it("execute test case5", () =>
    {
        const object = execute({
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "filters": [],
            "blendMode": "add"
        });
        expect("matrix" in object).toBe(false);
        expect("colorTransform" in object).toBe(false);
        expect("surfaceFilterList" in object).toBe(false);
        expect("blendMode" in object).toBe(true);
    });
});