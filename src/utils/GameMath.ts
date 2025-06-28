import { Point, Rectangle } from "pixi.js";

export class GameMath {
    public getDistanceToTarget(point: Point, target: Point):number {
        const dx = target.x - point.x;
        const dy = target.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public checkIsTargetInRectangleArea(target: Rectangle, rectangle: Rectangle):Boolean {
        return ( target.x + target.width > rectangle.x &&
                target.x < rectangle.x + rectangle.width &&
                target.y + target.height > rectangle.y &&
                target.y < rectangle.y + rectangle.height );
    }
}