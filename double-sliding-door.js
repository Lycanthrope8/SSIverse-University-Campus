console.log("Loading double-sliding-door component...");
WL.registerComponent(
  "double-sliding-door",
  {
    leftDoorObject: { type: WL.Type.Object },
    rightDoorObject: { type: WL.Type.Object },
    slideDistance: { type: WL.Type.Float, default: 1.0 },
    speed: { type: WL.Type.Float, default: 2.0 },
  },
  {
    init: function () {
      this.isOpen = false;
      this.leftClosedPos = new Float32Array(3);
      this.rightClosedPos = new Float32Array(3);
      this.leftOpenPos = new Float32Array(3);
      this.rightOpenPos = new Float32Array(3);
    },

    start: function () {
      // Save closed positions
      this.leftDoorObject.getTranslationLocal(this.leftClosedPos);
      this.rightDoorObject.getTranslationLocal(this.rightClosedPos);

      // Calculate open positions
      glMatrix.vec3.copy(this.leftOpenPos, this.leftClosedPos);
      glMatrix.vec3.copy(this.rightOpenPos, this.rightClosedPos);
      this.leftOpenPos[0] -= this.slideDistance;
      this.rightOpenPos[0] += this.slideDistance;

      // Add click listener to parent object (or use a trigger)
      this.object.getComponent("collision")?.onClick.add(() => {
        this.isOpen = !this.isOpen;
      });
    },

    update: function (dt) {
      let leftTarget = this.isOpen ? this.leftOpenPos : this.leftClosedPos;
      let rightTarget = this.isOpen ? this.rightOpenPos : this.rightClosedPos;

      let currentLeft = this.leftDoorObject.transformLocal.getTranslation();
      let currentRight = this.rightDoorObject.transformLocal.getTranslation();

      let newLeft = glMatrix.vec3.create();
      let newRight = glMatrix.vec3.create();

      glMatrix.vec3.lerp(newLeft, currentLeft, leftTarget, dt * this.speed);
      glMatrix.vec3.lerp(newRight, currentRight, rightTarget, dt * this.speed);

      this.leftDoorObject.transformLocal.setTranslation(newLeft);
      this.rightDoorObject.transformLocal.setTranslation(newRight);
    },
  }
);
