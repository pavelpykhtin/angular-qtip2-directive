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
            qtipVisible : '=',
            qtipContent: '=',
            qtipTitle: '='
        },
        link: function(scope, element, attrs) {
          var my = attrs.qtipMy
            , at = attrs.qtipAt
            , qtipClass = attrs.qtipClass
            , content = scope.qtipContent;

          if (attrs.qtipTitle) {
            content = {'title': scope.qtipTitle, 'text': scope.qtip};
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
          var options = angular.merge({}, qtipDefaults.defaults, attrOptions);
          options.position.target = element;

          var api = $(element)
            .qtip(options)
            .qtip('api');

          if(attrs.qtipVisible) {
              scope.$watch('qtipVisible', function (newValue, oldValue) {
                  $(element).qtip('toggle', newValue);
              });
          }

          if (attrs.qtipContent) {
            scope.$watch('qtipContent', function (newValue, oldValue) {
              $(element).qtip('option', 'content.text', newValue);

              if (newValue)
                $(element).qtip('enable');
              else
                $(element).qtip('disable');

            });
          }
          if (attrs.qtipTitle) {
            scope.$watch('qtipTitle', function (newValue, oldValue) {
              $(element).qtip('option', 'content.title', newValue);
            });
          }

          scope.$on('$destroy', function () {
            if(api)
              api.destroy(true);
          });
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
