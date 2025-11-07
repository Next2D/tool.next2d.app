import { execute as screenMenuShowUseCase } from "./ScreenMenuShowUseCase";
import { execute as screenMenuInitializeRegisterPointerOverUseCase } from "./ScreenMenuInitializeRegisterPointerOverUseCase";
import { execute as screenMenuTouchPointerDownUseCase } from "./ScreenMenuTouchPointerDownUseCase";
import { execute as screenMenuTouchPointerUpService } from "../service/ScreenMenuTouchPointerUpService";
import { execute as screenAlignMenuInitializeRegisterEventUseCase } from "@/menu/application/ScreenAlignMenu/usecase/ScreenAlignMenuInitializeRegisterEventUseCase";
import { execute as screenOrderMenuInitializeRegisterEventUseCase } from "@/menu/application/ScreenOrderMenu/usecase/ScreenOrderMenuInitializeRegisterEventUseCase";
import { execute as screenMenuEditMovieClipPointerDownEventUseCase } from "./ScreenMenuEditMovieClipPointerDownEventUseCase";
import { execute as screenMenuMoveParentMovieClipPointerDownEventUseCase } from "./ScreenMenuMoveParentMovieClipPointerDownEventUseCase";
import { execute as screenMenuPrevKeyframeCoordsPointerDownEventUseCase } from "./ScreenMenuPrevKeyframeCoordsPointerDownEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $SCREEN_ID,
    $SCREEN_CHANGE_SCENE_ID,
    $SCREEN_MOVE_SCENE_ID,
    $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID
} from "@/config/ScreenConfig";

/**
 * @description スクリーンメニューの初期起動時のイベント登録
 *              Registration of events at initial startup of screen menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const screenElement: HTMLElement | null = document
        .getElementById($SCREEN_ID);

    if (screenElement) {
        screenElement.addEventListener("contextmenu", screenMenuShowUseCase);

        // タッチデバイスのタッチイベント
        screenElement.addEventListener(
            EventType.POINTER_DOWN,
            screenMenuTouchPointerDownUseCase
        );
        screenElement.addEventListener(
            EventType.POINTER_UP,
            screenMenuTouchPointerUpService
        );
        screenElement.addEventListener(
            EventType.POINTER_CANCEL,
            screenMenuTouchPointerUpService
        );
        screenElement.addEventListener(
            EventType.POINTER_LEAVE,
            screenMenuTouchPointerUpService
        );
    }

    // マウスオーバーイベントを登録
    screenMenuInitializeRegisterPointerOverUseCase();

    // スクリーンメニューの整列エリアのイベント登録
    screenAlignMenuInitializeRegisterEventUseCase();

    // スクリーンメニューの重ね順エリアのイベント登録
    screenOrderMenuInitializeRegisterEventUseCase();

    // MovieClip編集ボタンのイベントを登録
    const editMovieClipElement: HTMLElement | null = document
        .getElementById($SCREEN_CHANGE_SCENE_ID);

    if (editMovieClipElement) {
        editMovieClipElement.addEventListener(
            EventType.POINTER_DOWN,
            screenMenuEditMovieClipPointerDownEventUseCase
        );
    }

    // 親のシーン移動ボタンのイベントを登録
    const moveParentSceneElement: HTMLElement | null = document
        .getElementById($SCREEN_MOVE_SCENE_ID);

    if (moveParentSceneElement) {
        moveParentSceneElement.addEventListener(
            EventType.POINTER_DOWN,
            screenMenuMoveParentMovieClipPointerDownEventUseCase
        );
    }

    // 前のキーフレームの座標に合わせるボタンのイベントを登録
    const prevKeyframeCoordsElement: HTMLElement | null = document
        .getElementById($SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID);

    if (prevKeyframeCoordsElement) {
        prevKeyframeCoordsElement.addEventListener(
            EventType.POINTER_DOWN,
            screenMenuPrevKeyframeCoordsPointerDownEventUseCase
        );
    }
};