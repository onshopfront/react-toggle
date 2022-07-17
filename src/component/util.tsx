import { MouseEvent, TouchEvent } from "react";

// Copyright 2015-present Drifty Co.
// http://drifty.com/
// from: https://github.com/driftyco/ionic/blob/master/src/util/dom.ts

export function pointerCoord(event: MouseEvent | TouchEvent) {
    // get coordinates for either a mouse click
    // or a touch depending on the given event
    if (event) {
        const changedTouches = (event as TouchEvent).changedTouches
        if (changedTouches && changedTouches.length > 0) {
            const touch = changedTouches[0]
            return { x: touch.clientX, y: touch.clientY }
        }
        const pageX = (event as MouseEvent).pageX
        if (pageX !== undefined) {
            return { x: pageX, y: (event as MouseEvent).pageY }
        }
    }
    return { x: 0, y: 0 }
}
