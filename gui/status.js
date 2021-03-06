/**@overview Contains class GuiStatus and its modules.*/

function GuiStatus() {
  /** @class GuiStatus
   * @memberof module:GUI Managers
   * @classdesc Class used for defining current app GUI status.
   * @prop {Number} editingFiber=undefined; Index of currently being edited fiber. If any, undefined.
   * @prop {Number} editingCP=undefined; Index of currently being edited control point. If any, undefined.
   * @prop {Number} editingRegion=undefined; Index of currently being edited isotropic region. If any, undefined.
   * @prop {Boolean} previewing=false Whether preview mode is active or not.
   * @prop {Boolean} dragAndDropping=false Whether drag and drop control point edit mode is active or not.
   */

  this.previewing = false;
  document.getElementById("switchViewButton").disabled = true;

  this.dragAndDropping = false;

  this.editingFiber = undefined;
  this.editingCP = undefined;
  this.editingRegion = undefined;
  this.skeleting = undefined;
}

GuiStatus.prototype = {
  editing: function(element, index) {
    /** @function editing
     * @memberof module:GUI Managers.GuiStatus
     * @param {String} element Element to be edited. 'fiber', 'CP' or 'region'.
     * @param {Number} index Index of the element in its array.
     * @desc Changes the properties of the object matching the specified input.
     */
    switch (element) {
      case 'fiber':
        this.unediting();
        this.editingFiber = index;
        break;
      case 'CP':
        if (this.editingFiber === undefined) {
          console.error('Tried to edit CP with any fiber in edit!');
          break;
        }
        this.editingCP = index;
        break;
      case 'region':
        this.unediting();
        this.editingRegion = index;
        break;
      default:
        console.error('Element string in status was not correct');
    }

    document.getElementById("switchViewButton").disabled = false;
    if (!this.previewing) {
      document.getElementById("switchViewButton").className = 'w3-btn w3-border-top w3-border-left w3-border-right w3-hover-aqua w3-block w3-ripple';
    }
  },
  retrieve: function() {
    /** @function retrieve
     * @memberof module:GUI Managers.GuiStatus
     * @desc Turns the scene into the current status. Refreshes the GUI.
     */
    if (this.previewing) {
      phantom.addToScene(scene);
      if (this.skeleting) {
        phantom.addSkeleton(scene);
      }
    } else {
      if (this.editingFiber !== undefined) {
        fiberSelectClick(this.editingFiber, true);
        if (this.editingCP !== undefined) {
          cpSelectClick(this.editingFiber, this.editingCP, true);
          if (guiStatus.dragAndDropping) {
            guiStatus.dragAndDropping = false; //Simulate D&D bare click
            document.getElementById('ddbutton').onclick();
          }
        }
      } else if (this.editingRegion !== undefined) {
        regionSelectClick(this.editingRegion, true)
        if (guiStatus.dragAndDropping) {
          guiStatus.dragAndDropping = false; //Simulate D&D bare click
          document.getElementById('ddbutton').onclick();
        }
      } else {
        if (this.skeleting) {
          phantom.addAsSkeleton(scene);
        } else {
          phantom.addToScene(scene);
        }
        editExit();
      }
    }
  },
  unediting: function() {
    /** @function unediting
     * @memberof module:GUI Managers.GuiStatus
     * @desc Turns the scene into unediting status. Restores the GUI.
     */
    this.previewing = false;
    this.dragAndDropping = false;
    scene.removeControls();

    document.getElementById("switchViewButton").value = "Preview";
    document.getElementById("switchViewButton").disabled = true;
    document.getElementById("switchViewButton").className = 'w3-btn w3-border-top w3-border-left w3-border-right w3-hover-aqua w3-block w3-ripple';

    this.editingFiber = undefined;
    this.editingCP = undefined;
    this.editingRegion = undefined;
  },
  isEditing: function() {
    /** @function isEditing
     * @memberof module:GUI Managers.GuiStatus
     * @desc Returns true or false depending on if the user is or not in edit mode.
     * @returns {Boolean} If the user is or not in edit mode
     */

    if ((this.editingFiber !== undefined) || (this.editingRegion !== undefined)) {
      return true;
    } else {
      return false;
    }
  }
}
