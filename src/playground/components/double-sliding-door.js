import { Component, Property } from "@wonderlandengine/api";
import { vec3 } from "gl-matrix";

export class SlidingDoorAnimator extends Component {
  static TypeName = "sliding-door-animator";

  static Properties = {
    leftDoor: Property.object(),
    rightDoor: Property.object(),
    slideDistance: Property.float(1.0),
    autoCloseDelay: Property.float(5.0), // delay in seconds before auto-close
  };

  start() {
    console.log("SlidingDoorAnimator started");
    const cursorTarget = this.object.getComponent("cursor-target");
    if (!cursorTarget) {
      console.warn("No CursorTarget component found!");
      return;
    }

    this.isOpen = false;
    this.animating = false;
    this.animationTime = 0;
    this.duration = 0.5; // seconds
    this.autoCloseTimer = 0;
    this.waitToClose = false;

    // Initial positions
    this.closedPosLeft = vec3.clone(this.leftDoor.getPositionWorld());
    this.closedPosRight = vec3.clone(this.rightDoor.getPositionWorld());

    this.openPosLeft = vec3.clone(this.closedPosLeft);
    this.openPosRight = vec3.clone(this.closedPosRight);

    this.openPosLeft[0] += this.slideDistance;
    this.openPosRight[0] -= this.slideDistance;

    cursorTarget.onClick.add(() => {
      if (!this.animating && !this.waitToClose) {
        this.animating = true;
        this.animationTime = 0;
      }
    });
  }

  update(dt) {
    if (this.animating) {
      this.animationTime += dt;
      const t = Math.min(this.animationTime / this.duration, 1.0);

      const fromLeft = this.isOpen ? this.openPosLeft : this.closedPosLeft;
      const toLeft = this.isOpen ? this.closedPosLeft : this.openPosLeft;

      const fromRight = this.isOpen ? this.openPosRight : this.closedPosRight;
      const toRight = this.isOpen ? this.closedPosRight : this.openPosRight;

      const newLeft = vec3.lerp(vec3.create(), fromLeft, toLeft, t);
      const newRight = vec3.lerp(vec3.create(), fromRight, toRight, t);

      this.leftDoor.setPositionWorld(newLeft);
      this.rightDoor.setPositionWorld(newRight);

      if (t >= 1.0) {
        this.animating = false;

        if (!this.isOpen) {
          // Door just opened — start countdown to auto-close
          this.waitToClose = true;
          this.autoCloseTimer = 0;
        }

        this.isOpen = !this.isOpen;
      }
    }

    if (this.waitToClose && !this.animating) {
      this.autoCloseTimer += dt;
      if (this.autoCloseTimer >= this.autoCloseDelay) {
        this.animating = true;
        this.animationTime = 0;
        this.waitToClose = false;
      }
    }
  }
}
