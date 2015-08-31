(function () {
  "use strict";
  angular
    .module('privlyChat')
    .directive('inputBox', inputBox);

  angular
    .module('privlyChat')
    .directive('messageBox', messageBox);


  function inputBox($rootScope) {
    var ENTER_KEY_CODE = 13;

    return {
      restrict : 'A',
      link : link
    };

    function link(scope, element, attrs) {

      var keyCode;

      element.on('keydown keypress', function(event) {
        keyCode = event.which || event.keyCode;

        // If enter key is pressed
        if (keyCode === ENTER_KEY_CODE) {
          if(scope.textInput != "") {
            if(scope.textInput[0] === '/') {
              var command = scope.textInput.split(/\s(.+)/)[0].substring(1);
              var text = scope.textInput.split(/\s(.+)/)[1];
              $rootScope.$broadcast(command, {event: command, text: text});
            } else {
              $rootScope.$broadcast('processText', {text : scope.textInput});
            }
            scope.textInput = "";
            scope.$apply();
          }
          event.preventDefault();
        }
      });
    }//END link
  }//END directive inputBox

  function messageBox() {
    return {
      restrict : 'A',
      link : link
    };

    function link(scope, element, attrs) {
      scope.$on('addTextToBox', updateMessageBox);

      function updateMessageBox(event, args) {
        var name1 = scope.vm.name;
        element.append("<div>" + name1 + " : " + args.text + "</div>");
      }

    }//END link
  }//END directive messageBox
})();