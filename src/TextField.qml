import QtQuick 2.1
import QtQuick.Controls 1.2

TextInput {
  property string placeholderText

  onPlaceholderTextChanged: this.dom.firstChild.placeholder = placeholderText;
}
