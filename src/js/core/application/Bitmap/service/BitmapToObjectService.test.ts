import { execute } from "./BitmapToObjectService";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { $BITMAP_TYPE } from "../../../../config/InstanceConfig";
import { describe, it, expect } from "vitest";

describe("BitmapToObjectService", () =>
{
    it("should convert Bitmap to IBitmapSaveObject correctly", () =>
    {
        const bitmap = new Bitmap({
            "id": 123,
            "name": "testBitmap",
            "type": $BITMAP_TYPE,
            "symbol": "bitmap.symbol1",
            "folderId": 1,
            "width": 100,
            "height": 200,
            "imageType": "image/png"
        });

        bitmap.buffer = new Uint8Array([0xAB, 0xCD, 0xEF]);

        expect(execute(bitmap)).toEqual({
            "id": 123,
            "name": "testBitmap",
            "type": $BITMAP_TYPE,
            "symbol": "bitmap.symbol1",
            "folderId": 1,
            "width": 100,
            "height": 200,
            "imageType": "image/png",
            "buffer": "«Íï"
        });
    });
});