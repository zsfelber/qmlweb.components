Item {
  id: obj
  
  property var target: parent
  property var property: "value"
  property var propertyWrite: property
  property var name

  property var timeout: 500

  property var enabled: true

 /* 
  onValueChanged: {
    //console.log(name,value);
    //params_update_hash();
  }
 */

  property var timeout_id 

  function params_update_hash()
  {
     
     if (!name || name.length == 0) return;
     if (engine.operationState === QMLOperationState.Init) return;
     //debugger;
     // нее if (timeout_id) return;
     if (timeout_id) window.clearTimeout( timeout_id );

     timeout_id = window.setTimeout( function() {

     var oo = {};
     if (location.hash.length >= 10) oo = JSON.parse( location.hash.substr(1) );
     if (!oo.params) oo.params = {};

     if (obj.enabled) {
 	   var value = target[property];     
       oo.params[name] = value;
     }
     else
      delete oo.params[name]

     var strpos = JSON.stringify( oo ); 
     //console.log(">>>> setting url hash from param",name,value);
     location.hash = strpos;
     timeout_id = null;

     }, timeout );
  }  

  function params_parse_hash()
  {
    if (!name || name.length == 0) return;
    if (location.hash.length < 10) return {};
    var oo = JSON.parse( location.hash.substr(1) );
    if (oo.params == null) return {};
    if (oo.params.hasOwnProperty(name)) {
      //console.log(">>>setting param from url-hash",name,oo.params[name]);
      target[propertyWrite] = oo.params[name]; 
    }
  }
  
  Component.onCompleted: {
    params_parse_hash()
    target[property+"Changed"].connect( obj,params_update_hash );
  }

}