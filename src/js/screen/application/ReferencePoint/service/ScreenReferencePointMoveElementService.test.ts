import { execute } from "./ScreenReferencePointMoveElementService";
import { $REFERENCE_POINT_ID } from "@/config/ReferenceSettingConfig";
import { 
    $getReferencePointState,
    $setReferencePointState 
} from "../ReferencePointUtil";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("ScreenReferencePointMoveElementServiceTest", () =>
{
    let testElement: HTMLElement;

    beforeEach(() =>
    {
        // テスト用のDOM要素を作成
        testElement = document.createElement("div");
        testElement.id = $REFERENCE_POINT_ID;
        
        // 初期位置を設定（absoluteポジション要素として設定）
        testElement.style.position = "absolute";
        testElement.style.left = "100px";
        testElement.style.top = "200px";
        testElement.style.width = "50px";
        testElement.style.height = "50px";
        
        document.body.appendChild(testElement);
        
        // 初期状態をshow状態に設定
        $setReferencePointState("show");
    });

    afterEach(() =>
    {
        // テスト後のクリーンアップ
        if (testElement && testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
        }
    });

    it("正の移動量でのX座標移動 - Move X coordinate with positive movement", () =>
    {
        // offsetプロパティをモック化して確実な値を設定
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });

        // 初期位置の確認
        expect(testElement.offsetLeft).toBe(100);
        expect(testElement.offsetTop).toBe(200);

        execute(50, 0);

        // X座標のみが移動することを確認
        expect(testElement.style.left).toBe("150px"); // 100 + 50
        expect(testElement.style.top).toBe("200px"); // 変更なし
    });

    it("正の移動量でのY座標移動 - Move Y coordinate with positive movement", () =>
    {
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });
        
        execute(0, 75);

        // Y座標のみが移動することを確認
        expect(testElement.style.left).toBe("100px"); // 変更なし
        expect(testElement.style.top).toBe("275px"); // 200 + 75
    });

    it("X,Y両方向への移動 - Move in both X and Y directions", () =>
    {
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });

        execute(30, 40);

        // 両方向の移動を確認
        expect(testElement.style.left).toBe("130px"); // 100 + 30
        expect(testElement.style.top).toBe("240px"); // 200 + 40
    });

    it("負の移動量での移動 - Move with negative movement values", () =>
    {
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });

        execute(-25, -35);

        // 負の移動量での移動を確認
        expect(testElement.style.left).toBe("75px"); // 100 - 25
        expect(testElement.style.top).toBe("165px"); // 200 - 35
    });

    it("小数点を含む移動量での移動 - Move with decimal movement values", () =>
    {
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });

        execute(12.5, -7.3);

        // 小数点を含む移動量での移動を確認
        expect(testElement.style.left).toBe("112.5px"); // 100 + 12.5
        expect(testElement.style.top).toBe("192.7px"); // 200 - 7.3
    });

    it("ゼロの移動量では何もしない - Do nothing with zero movement", () =>
    {
        const initialLeft = testElement.style.left;
        const initialTop = testElement.style.top;

        execute(0, 0);

        // 位置が変更されないことを確認
        expect(testElement.style.left).toBe(initialLeft);
        expect(testElement.style.top).toBe(initialTop);
    });

    it("片方がゼロの移動量 - One direction with zero movement", () =>
    {
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });
        // X方向のみの移動（Y=0）
        execute(20, 0);
        expect(testElement.style.left).toBe("120px");
        expect(testElement.style.top).toBe("200px");

        // 位置をリセット
        testElement.style.left = "100px";
        testElement.style.top = "200px";

        // Y方向のみの移動（X=0）
        execute(0, 15);
        expect(testElement.style.left).toBe("100px");
        expect(testElement.style.top).toBe("215px");
    });

    it("hide状態では移動しない - Do not move when in hide state", () =>
    {
        // hide状態に設定
        $setReferencePointState("hide");
        expect($getReferencePointState()).toBe("hide");

        const initialLeft = testElement.style.left;
        const initialTop = testElement.style.top;

        execute(100, 50);

        // 位置が変更されないことを確認
        expect(testElement.style.left).toBe(initialLeft);
        expect(testElement.style.top).toBe(initialTop);
    });

    it("要素が存在しない場合は何もしない - Do nothing if element doesn't exist", () =>
    {
        // テスト要素を削除
        testElement.remove();

        // エラーが発生しないことを確認
        expect(() => execute(50, 30)).not.toThrow();
    });

    it("引数なしでの呼び出し（デフォルト値0,0） - Call without arguments (default values 0,0)", () =>
    {
        const initialLeft = testElement.style.left;
        const initialTop = testElement.style.top;

        execute();

        // デフォルト値0,0なので位置が変更されないことを確認
        expect(testElement.style.left).toBe(initialLeft);
        expect(testElement.style.top).toBe(initialTop);
    });

    it("片方のみの引数指定 - Specify only one argument", () =>
    {
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });

        execute(25);

        // X方向のみ移動（Y方向はデフォルト0）
        expect(testElement.style.left).toBe("125px"); // 100 + 25
        expect(testElement.style.top).toBe("200px"); // 変更なし
    });

    it("複数回の移動で累積的に位置が変わる - Cumulative position changes with multiple moves", () =>
    {
        // offsetLeftとoffsetTopをモック化
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 100,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 200,
            configurable: true
        });

        execute(10, 15);
        expect(testElement.style.left).toBe("110px");
        expect(testElement.style.top).toBe("215px");

        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 110,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 215,
            configurable: true
        });
        execute(5, -10);
        expect(testElement.style.left).toBe("115px"); // 110 + 5
        expect(testElement.style.top).toBe("205px"); // 215 - 10

        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 115,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 205,
            configurable: true
        });
        execute(-20, 25);
        expect(testElement.style.left).toBe("95px"); // 115 - 20
        expect(testElement.style.top).toBe("230px"); // 205 + 25
    });

    it("要素の初期位置が異なる場合の移動 - Move when element has different initial position", () =>
    {
        // offsetLeftとoffsetTopをモック化
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => 50,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => 75,
            configurable: true
        });

        execute(25, 30);

        expect(testElement.style.left).toBe("75px"); // 50 + 25
        expect(testElement.style.top).toBe("105px"); // 75 + 30
    });

    it("offsetプロパティが動的に変化する場合のテスト - Test when offset properties change dynamically", () =>
    {
        let currentLeft = 100;
        let currentTop = 200;

        // 動的に変化するoffsetプロパティをモック化
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => currentLeft,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => currentTop,
            configurable: true
        });

        // 1回目の移動
        execute(20, 30);
        expect(testElement.style.left).toBe("120px"); // 100 + 20
        expect(testElement.style.top).toBe("230px"); // 200 + 30

        // offsetの値を変更（実際の移動をシミュレート）
        currentLeft = 120;
        currentTop = 230;

        // 2回目の移動
        execute(10, -15);
        expect(testElement.style.left).toBe("130px"); // 120 + 10
        expect(testElement.style.top).toBe("215px"); // 230 - 15
    });

    it("offsetが負の値の場合のテスト - Test when offset values are negative", () =>
    {
        // 負のoffset値をモック化
        Object.defineProperty(testElement, 'offsetLeft', {
            get: () => -50,
            configurable: true
        });
        Object.defineProperty(testElement, 'offsetTop', {
            get: () => -25,
            configurable: true
        });

        execute(30, 40);

        expect(testElement.style.left).toBe("-20px"); // -50 + 30
        expect(testElement.style.top).toBe("15px"); // -25 + 40
    });
});
