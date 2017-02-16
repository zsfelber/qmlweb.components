// http://doc.qt.io/qt-5/qml-qtqml-binding.html
import QtQuick 2.1
import QtQuick.Controls 1.2

Item {
  property string property
  property var    target 
  property var    value 
  property bool   when: true

  onValueChanged: transfer_value()
  onTargetChanged: {
//    console.log(">>>>>>>> target changed to",target ? target.id : "NULL");
    transfer_value()
  }
  onPropertyChanged: transfer_value()

  function transfer_value() {
    if (!when) return;
    if (!target || !property) return;
//    console.log("transfering ",value,"to",property,"target=",target);
//    debugger;
    target[property] = value;
  }
}
