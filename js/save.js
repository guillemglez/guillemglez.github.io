/**@overview Contains functions regarding the parse, export and download process of a Phantom.*/
// Parsable objects must contain only those parameters the loaders expect to find

// Returns a JSON string with the phantom in ParsableFiber and ParsableRegion classes
Phantom.prototype.export = function() {
  /** @function export
    * @memberof Phantom
    * @desc Parses Fibers and Isotropic Regions in the Phantom and returns a parsed, indented string.
    <br>The JSON is fully compatible with Phantomas. Name string is used as name for property in JSON file.
    Uppercase, spaces and non-alphanumeric characters are removed. In case two elements
    share the same name, numeric values will be added at the end.
    <br>Information from fibers:
    <ul><li>Control points
    <li>Tangents
    <li>Radius
    <li>Color
    </ul>
    Information from Isotropic Regions:
    <ul><li>Center
    <li>Radius
    <li>Color
    </ul>
    * @returns {String} Parsed variable ready for pushing to download.
  */
  // PRIVATE CONSTRUCTORS
  ParsableFiber = function(control_points, tangents, radius, color) {
    this.control_points = control_points;
    this.tangents = tangents;
    this.radius = Number(radius);
    this.color = Number(color.getHex());
  }
  ParsableRegion = function(center, radius, color) {
    this.center = center;
    this.radius = Number(radius);
    this.color = Number(color.getHex());
  }


  var parsable_phantom = new Object;
  parsable_phantom.fiber_geometries = new Object;
  parsable_phantom.isotropic_regions = new Object;

  // FIBERS
  this.fibers.source.forEach(function(source, index) {
    var control_points = [];
    // Control Points are expected in a unique string.
    source.controlPoints.forEach(function(cp) {
      cp.forEach(function(element) {
        control_points.push(element);
      });
    });

    // Lowercase and replace spaces for underscore. Remove non alphanumeric characters.
    var name = (source.name.toLowerCase()).replace(" ", "_").replace(/\W+/g, "");
    // Check wheter this name exists or is empty. If so, add numbering.
    var found = 0;
    if (name == "") {
      name = found.toString();
    }
    while (parsable_phantom.fiber_geometries[name]) {
      if (found) { // If already numbered we clear the number present
        name = name.slice(0, (found - 1).toString().length * -1);
      }
      name += found.toString();
      found++;
    }

    var parsable_fiber = new ParsableFiber(control_points, source.tangents, source.radius, source.color);
    parsable_phantom.fiber_geometries[name] = parsable_fiber;
  });

  // ISOTROPICREGIONS
  this.isotropicRegions.source.forEach(function(source, index) {
    // Lowercase and replace spaces for underscore. Remove non alphanumeric characters.
    var name = (source.name.toLowerCase()).replace(" ", "_").replace(/\W+/g, "");
    // Check wheter this name exists or is empty. If so, add numbering.
    var found = 0;
    if (name == "") {
      name = found.toString();
    }
    while (parsable_phantom.isotropic_regions[name]) {
      if (found) { // If already numbered we clear the number present
        name = name.slice(0, (found - 1).toString().length * -1);
      }
      name += found.toString();
      found++;
    }

    var parsable_region = new ParsableRegion(source.center, source.radius, source.color);
    parsable_phantom.isotropic_regions[name] = parsable_region;
  });

  // null,2 automatically indents json file
  var parsed_phantom = JSON.stringify(parsable_phantom, null, 2);

  return parsed_phantom;
}

pushDownload = function(content) {
  /** @function pushDownload
    * @desc Pushes to the navigator the download of a string as a  ddmmyyyyhhmm-phantom_save.JSON file.
    <br> Requires an &lt;a&gt; element in the HTML with id="downloadAnchorElem".
    * @param {string} content A string containing the content to be included in the file.
  */

  // From http://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
  function timestamp() {
    // Partly from https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1; //January is 0!
    if (mm < 10) {
      mm = '0' + mm;
    }
    var dd = today.getDate();
    if (dd < 10) {
      dd = '0' + dd;
    }
    var hh = today.getHours();
    if (hh < 10) {
      hh = '0' + hh;
    }
    var mn = today.getMinutes();
    if (mn < 10) {
      mn = '0' + mn;
    }

    var timestamp = dd + mm + yyyy + hh + mn;
    return timestamp;
  }
  var uriContent = "data:text/json;charset=utf-8," + encodeURIComponent(content);
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", uriContent);
  dlAnchorElem.setAttribute("download", timestamp() + "-phantom_save.json");
  dlAnchorElem.click();
}
