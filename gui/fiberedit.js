function fiberEdit( index ) {
  resizeGUI();
  scene.removeCPHighlight(true);

  // editGUI is emptied
  var editGUI = document.getElementById('editGUI');
  editGUI.innerHTML = "";
  editGUI.style = "list-style-type: none";
  var field = document.createElement("FIELDSET");
  editGUI.appendChild(field);
  var fiberprops = document.createElement("UL");

  // NUMBER OF CONTROL POINTS AND COLOR
  var controlPointsAndColor = document.createElement("LEGEND");
  var colorSpan = document.createElement("span");
  colorSpan.style.color = phantom.fibers.tube[index].color.getStyle();
  colorSpan.style.fontSize = 'x-large';
  colorSpan.innerHTML = '&nbsp;&nbsp;&#9632;';

  var controlPointsSpan = document.createElement("span");
  controlPointsSpan.innerHTML = phantom.fibers.source[index].controlPoints.length + " Points";

  controlPointsAndColor.appendChild(controlPointsSpan);
  controlPointsAndColor.appendChild(colorSpan);

  field.appendChild(controlPointsAndColor);

  // LENGTH
  var length = document.createElement("LI");
  var lengthspan = document.createElement("SPAN");
  length.appendChild(lengthspan);

  lengthspan.id = "fiberLength";
  lengthspan.innerHTML = Math.floor(phantom.fibers.source[index].length * 10) / 10;

  length.innerHTML += " units long";
  fiberprops.appendChild(length);

  // RADIUS
  var radius = document.createElement("LI");
  var radiuslabel = document.createElement("LABEL");
  radiuslabel.innerHTML = "Radius: ";
  var geometry = phantom.fibers.tube[index].mesh.geometry;

  var radiusvalue = document.createElement("INPUT");
  radiusvalue.style.width = "50px";
  radiusvalue.type = "number";
  radiusvalue.min = 0;
  radiusvalue.step = .1;
  radiusvalue.value = phantom.fibers.source[index].radius;
  radiusvalue.onchange = function() {
    phantom.fibers.source[index].radius = this.value;
    phantom.fibers.source[index].notify();
  }

  radius.appendChild(radiuslabel);
  radius.appendChild(radiusvalue);
  fiberprops.appendChild(radius);

  // TANGENTS
  var tangentslabel = document.createElement("LABEL");
  tangentslabel.innerHTML = "Tangents: ";

  var tangents = document.createElement("SELECT");
  tangents.onchange = function() {
    phantom.fibers.source[index].tangents = this.value;
    phantom.fibers.source[index].polyCalc();
    phantom.fibers.source[index].notify();
  }
  var symmetric = document.createElement("OPTION");
  symmetric.value = "symmetric";
  symmetric.innerHTML = "Symmetric";
  tangents.options.add(symmetric);
  var incoming = document.createElement("OPTION");
  incoming.value = "incoming";
  incoming.innerHTML = "Incoming";
  tangents.options.add(incoming);
  var outgoing = document.createElement("OPTION");
  outgoing.value = "outgoing";
  outgoing.innerHTML = "Outgoing";
  tangents.options.add(outgoing);

  tangents.value = phantom.fibers.source[index].tangents;
  fiberprops.appendChild(tangentslabel);
  fiberprops.appendChild(tangents);
  editGUI.appendChild(document.createElement("BR"));

  field.appendChild(fiberprops);

  addCPselect();
}

function addCPselect() {
  var editGUI = document.getElementById('editGUI');
  // CONTROL POINTS SELECTION LIST
  var cplist = document.createElement("SELECT");
  var fiberindex = guiStatus.editingFiber;
  cplist.size = phantom.fibers.source[fiberindex].controlPoints.length + 1;
  cplist.id = 'cpSelector';
  cplist.style.width = (document.getElementById("leftGUI").offsetWidth - 10).toString() + 'px';
  cplist.onmouseout = function () {
    if (cplist.selectedIndex) {
      scene.removeCPHighlight();
    } else {
      scene.removeCPHighlight(true);
    }
  };

  var option = document.createElement("option");
  option.text = '*n*'
  option.selected = true;
  option.onclick = function () {

    exitCPedit();
  };
  cplist.options.add(option);

  phantom.fibers.source[fiberindex].controlPoints.forEach(
    function(point, index) {
      var option = document.createElement("option");
      option.text = index.toString();
      option.onmouseover = function() {
        phantom.cpHighlight(fiberindex, index, 'blue');
      };
      option.onclick = function() {
        cpSelectClick(fiberindex, index);
      };

      cplist.options.add(option);
    }
  );
  editGUI.appendChild(cplist);

}
