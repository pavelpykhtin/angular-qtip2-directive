!function($) {

  'use strict';

  angular.module('qtip2', [])
    .provider('qtipDefaults', function(){
      var self = this;
      
      self.defaults = {
        position: {
          my: 'bottom center',
          at: 'top center'
        },
        hide: {
          fixed : true,
          delay : 100
        },
        style: 'qtip'
      };

      self.$get = getDefaults;
      self.setDefaults = setDefaults;

      function setDefaults(defaults){
        if(!defaults)
          defaults = {};

        return angular.merge(self.defaults, defaults);
      }

      function getDefaults(){
        return self;
      }
    })
    .directive('qtip', ['qtipDefaults', function(qtipDefaults) {
      return {
        restrict: 'A',
        scope : {
            qtipVisible : '='
        },
        link: function(scope, element, attrs) {
          var my = attrs.qtipMy
            , at = attrs.qtipAt
            , qtipClass = attrs.qtipClass
            , content = attrs.qtipContent || attrs.qtip;

          if (attrs.qtipTitle) {
            content = {'title': attrs.qtipTitle, 'text': attrs.qtip};
          }

          var attrOptions = {
            content: content,
            position: {
              my: my,
              at: at
            },
            style: qtipClass
          }

          removeEmpties(attrOptions);
          var options = angular.merge({}, qtipDefaults, attrOptions);
          options.position.target: element;

          $(element).qtip(options);

          if(attrs.qtipVisible) {
              scope.$watch('qtipVisible', function (newValue, oldValue) {
                  $(element).qtip('toggle', newValue);
              });
          }
        }
      }

      function removeEmpties(obj, deep) {
        var k, results, v;
        if (deep == null) {
          deep = true;
        }
        results = [];
        for (k in obj) {
          v = obj[k];
          if ((v != null) && typeof v === 'object' && deep) {
            results.push(removeEmpties(obj[k], deep));
          } else if (v == null) {
            results.push(delete obj[k]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    }]);
}(window.jQuery);
