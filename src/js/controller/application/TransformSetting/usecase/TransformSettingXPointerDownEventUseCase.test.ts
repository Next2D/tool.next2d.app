import { execute } from "./TransformSettingXPointerDownEventUseCase";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";
import { EventType } from "../../../../tool/domain/event/EventType";
import { Character } from "../../../../core/domain/model/Character";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { $TRANSFORM_OBJECT_Y_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingXPointerDownEventUseCase Test", () =>
{
    let yInputElement: HTMLInputElement;

    beforeEach(() => {
        // Y座標入力要素を作成してDOMに追加
        yInputElement = document.createElement("input");
        yInputElement.id = $TRANSFORM_OBJECT_Y_ID;
        yInputElement.value = "300";
        document.body.appendChild(yInputElement);
    });

    afterEach(() => {
        // クリーンアップ
        if (yInputElement && yInputElement.parentNode) {
            yInputElement.parentNode.removeChild(yInputElement);
        }
    });
    it("execute test case1", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        const layer = movieClip.layers[0];

        const bitmap = new Bitmap({
            id: 2,
            width: 100,
            height: 100
        });
        workSpace.libraries.set(bitmap.id, bitmap);

        const character = new Character();
        character.startFrame = 1;
        character.libraryId = 2;

        layer.addCharacter(character);
        movieClip.selectedDepths.set(0, [0]);

        let pointerId = 0;
        const input = document.createElement("input");
        input.value = "500";
        input.setPointerCapture = vi.fn((pointer_id) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        let pointerLeave = false;
        input.addEventListener = vi.fn((type) =>
        {
            switch (type)
            {
                case EventType.POINTER_MOVE:
                    pointerMove = true;
                    break;

                case EventType.POINTER_UP:
                    pointerUp = true;
                    break;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    break;

                case EventType.POINTER_LEAVE:
                    pointerLeave = true;
                    break;

                default:
                    throw new Error("Unknown event type");

            }
        });

        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            button: 0,
            target: input,
            pointerId: 100,
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            }),
            preventDefault: vi.fn(() =>
            {
                preventDefault = true;
            })
        } as unknown as PointerEvent;

        // reset
        transformSetting.clear();
        transformSetting.x = 100;
        transformSetting.y = 200;
        transformSetting.beforeX = 300;
        $updateKeyLock(false);

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        expect(pointerId).toBe(0);
        expect(transformSetting.x).toBe(100);
        expect(transformSetting.y).toBe(200);
        expect(transformSetting.beforeX).toBe(300);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);

        execute(mockEvent);

        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(false);
        expect(pointerId).toBe(100);
        expect(transformSetting.x).toBe(0);
        expect(transformSetting.y).toBe(0);
        expect(transformSetting.beforeX).toBe(500);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
    });

    it("execute test case2 テキスト入力中の動作確認", () =>
    {
        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            button: 0,
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            }),
            preventDefault: vi.fn(() =>
            {
                preventDefault = true;
            })
        } as unknown as PointerEvent;

        // reset
        $updateKeyLock(true);

        expect($useKeyboard()).toBe(true);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        
        execute(mockEvent);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(false);
    });
});