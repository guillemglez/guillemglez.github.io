var guiStatus;

function setupGUI() {
  guiStatus =  new GuiStatus();
  resizeGUI();

  var fiberSelector = document.getElementById("fiberSelector");
  var regionSelector = document.getElementById("regionSelector");
  // Empty them - this function might be called for GUIupdating
  fiberSelector.innerHTML = "";
  regionSelector.innerHTML = "";

  if (phantom.fibers.source.length > 0) {
    // Add *none* option
    var option = document.createElement("LI");
    option.innerHTML = '*none*'
    option.className = 'optionSelected';
    // If any fiber is being edited, move to non-edit mode
    option.onclick = function() {
      if (guiStatus.editingRegion === undefined) {
        guiStatus.unediting();
        guiStatus.retrieve();
      };
      resizeGUI();
      optionSelect(this);
    };
    option.onmouseenter = function() {phantom.addToScene(scene); optionOnMouseOver(this);};
    option.onmouseleave = function() {  removeOnMouseOver(); };
    fiberSelector.appendChild(option);
    fiberSelector.className = 'enabledList';

    // Add the rest of the options
    phantom.fibers.source.forEach( function(fiber, index) {
      var backgroundColor = fiber.color;

      var option = document.createElement("LI");
      var selectColorSpan = document.createElement("span");
      var selectTextSpan = document.createElement("span");
      selectColorSpan.style.color = backgroundColor.getStyle();
      selectColorSpan.innerHTML = '&#9632;&nbsp;';

      selectTextSpan.innerHTML = fiber.controlPoints.length.toString() + " points";

      option.appendChild(selectColorSpan);
      option.appendChild(selectTextSpan);
      option.className = 'optionUnselected';

      option.onmouseenter = function() {phantom.fiberHighlight(index); optionOnMouseOver(this);};
      option.onmouseleave = function() {  removeOnMouseOver(); };
      option.onclick = function() {fiberSelectClick(index); optionSelect(this)};
      fiberSelector.appendChild(option);
    });
  } else {
    var option = document.createElement("LI");
    option.innerHTML = '(any)'
    fiberSelector.appendChild(option);
    fiberSelector.className = 'disabledList';
  }

  if (phantom.isotropicRegions.source.length > 0) {
    // Add *none* option
    var option = document.createElement("LI");
    option.innerHTML = '*none*'
    option.className = 'optionSelected';
    // If any fiber is being edited, move to non-edit mode
    option.onclick = function() {
      if (guiStatus.editingFiber === undefined) {
        guiStatus.unediting();
        guiStatus.retrieve();
      };
      resizeGUI();
      optionSelect(this);
    };
    option.onmouseenter = function() {phantom.addToScene(scene); optionOnMouseOver(this);};
    option.onmouseleave = function() {  removeOnMouseOver(); };
    regionSelector.appendChild(option);
    regionSelector.className = 'enabledList';

    // Add the rest of the options
    phantom.isotropicRegions.source.forEach( function(region, index) {
      var backgroundColor = region.color;

      var option = document.createElement("LI");
      option.className = 'optionUnselected';
      var selectColorSpan = document.createElement("span");
      var selectTextSpan = document.createElement("span");
      selectColorSpan.style.color = backgroundColor.getStyle();
      selectColorSpan.innerHTML = '&#9632;&nbsp;';

      selectTextSpan.innerHTML = "radius " + region.radius.toString();

      option.appendChild(selectColorSpan);
      option.appendChild(selectTextSpan);

      option.onmouseover = function() {phantom.regionHighlight(index); optionOnMouseOver(this);};
      option.onmouseleave = function() {  removeOnMouseOver(); };
      option.onclick = function() {regionSelectClick(index); optionSelect(this)};
      regionSelector.appendChild(option);
    });
  } else {
    var option = document.createElement("LI");
    option.innerHTML = '(any)'
    regionSelector.appendChild(option);
    regionSelector.className = 'disabledList';
  }

  editExit();
}
