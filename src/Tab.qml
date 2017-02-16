import QtQuick 2.1
import QtQuick.Controls 1.2

Loader {
  property var title: "Tab"
  anchors.fill: parent
  
  active: false
  
  onVisibleChanged: if (visible) active = true;
}
