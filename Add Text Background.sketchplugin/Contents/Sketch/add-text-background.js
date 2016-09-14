// Generate Text Background by Ari Lacenski
// Source code available at https://github.com/tensory/generate-text-background
// Forked from https://github.com/anagorn/generate-text-background
// Updated for Sketch 3
//
var STYLE_FILL_TYPE = 0;
var STYLE_BORDER_TYPE = 1;
var FILL_COLOR = "#7ED321";
var STROKE_COLOR = "#417505";
var PADDING_PX = 5;

function onRun(context) {
  var doc = context.document;

  var layers = doc.selectedLayers();
  var textLayers = [];

  var loop = doc.selectedLayers().objectEnumerator();
  while (item = loop.nextObject()) {
    // do something with item
    if (item.className() == "MSTextLayer") {
      textLayers.push(item);      
    }
  }

  for (var i = 0; i < textLayers.length; i++) {
    createRect(textLayers[i], FILL_COLOR, STROKE_COLOR, PADDING_PX);
  }
};


function createRect(textLayer, fColor, sColor, paddingPx) {
  var textWidth = textLayer.frame().width();
  var textHeight = textLayer.frame().height();
  
  // Left positions of text layer
  var textX1 = textLayer.frame().x();
  var textY1 = textLayer.frame().y();
  // Right positions of text layer
  var textX2 = textX1 + textWidth;
  var textY2 = textY1 + textHeight;
  
  // By default, the rectangle becomes bigger in size by these four lines
  // Comment them out to get a strict rectangle
  textX1 = textX1 - paddingPx;
  textX2 = textX2 + paddingPx;
  textY1 = textY1 - paddingPx;
  textY2 = textY2 + paddingPx;

  var path = NSBezierPath.bezierPath();
  // Move to first position
  path.moveToPoint(NSMakePoint(textX1,textY1));
  // Draw line from left bottom to right bottom
  path.lineToPoint(NSMakePoint(textX2,textY1));
  // Draw line from right bottom to right top
  path.lineToPoint(NSMakePoint(textX2,textY2));
  // Draw line from right top to left top
  path.lineToPoint(NSMakePoint(textX1,textY2));
  // Draw line from left top to left bottom
  path.lineToPoint(NSMakePoint(textX1,textY1));
  // Close the path
  path.closePath();

  var shape = MSShapeGroup.shapeWithBezierPath(path);

  shape.style().addStylePartOfType(STYLE_FILL_TYPE).color = MSColor.colorWithSVGString(fColor);
  shape.style().addStylePartOfType(STYLE_BORDER_TYPE).color = MSColor.colorWithSVGString(sColor);
  
  // create the group layer
  var groupLayer = MSLayerGroup.new();
  groupLayer.name = textLayer.name() + " Group";
  var parent = textLayer.parentGroup(); 
  parent.addLayers([groupLayer]);

  shape.name = "Background";
  groupLayer.addLayers([shape]);

  // insert textLayer into group
  parent.removeLayer(textLayer);
  groupLayer.addLayers([textLayer]);
}