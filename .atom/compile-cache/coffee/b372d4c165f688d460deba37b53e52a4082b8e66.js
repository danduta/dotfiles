(function() {
  var Point, scopeDictionary;

  Point = require('atom').Point;

  scopeDictionary = {
    'cpp': 'c++',
    'c': 'c',
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstScopes: function(editor) {
      return editor.getCursors()[0].getScopeDescriptor().scopes;
    },
    getScopeLang: function(scopes) {
      var i, len, scope;
      for (i = 0, len = scopes.length; i < len; i++) {
        scope = scopes[i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    },
    prefixAtPosition: function(editor, bufferPosition) {
      var line, ref, regex;
      regex = /\w+$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((ref = line.match(regex)) != null ? ref[0] : void 0) || '';
    },
    nearestSymbolPosition: function(editor, bufferPosition) {
      var line, matches, regex, symbol, symbolColumn;
      regex = /(\W+)\w*$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(regex);
      if (matches) {
        symbol = matches[1];
        symbolColumn = matches[0].indexOf(symbol) + symbol.length + (line.length - matches[0].length);
        return [new Point(bufferPosition.row, symbolColumn), symbol.slice(-1)];
      } else {
        return [bufferPosition, ''];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2NvbW1vbi11dGlsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixlQUFBLEdBQWtCO0lBQ2hCLEtBQUEsRUFBa0IsS0FERjtJQUVoQixHQUFBLEVBQWtCLEdBRkY7SUFHaEIsWUFBQSxFQUFrQixLQUhGO0lBSWhCLFVBQUEsRUFBa0IsR0FKRjtJQUtoQixhQUFBLEVBQWtCLGFBTEY7SUFNaEIsZUFBQSxFQUFrQixlQU5GO0lBU2hCLFlBQUEsRUFBa0IsS0FURjtJQVVoQixlQUFBLEVBQWtCLGVBVkY7OztFQWFsQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsY0FBQSxFQUFnQixTQUFDLE1BQUQ7YUFDZCxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW9CLENBQUEsQ0FBQSxDQUFFLENBQUMsa0JBQXZCLENBQUEsQ0FBMkMsQ0FBQztJQUQ5QixDQUFoQjtJQUdBLFlBQUEsRUFBYyxTQUFDLE1BQUQ7QUFDWixVQUFBO0FBQUEsV0FBQSx3Q0FBQTs7UUFDRSxJQUFpQyxLQUFBLElBQVMsZUFBMUM7QUFBQSxpQkFBTyxlQUFnQixDQUFBLEtBQUEsRUFBdkI7O0FBREY7SUFEWSxDQUhkO0lBT0EsZ0JBQUEsRUFBa0IsU0FBQyxNQUFELEVBQVMsY0FBVDtBQUNoQixVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixjQUExQixDQUF0QjtxREFDWSxDQUFBLENBQUEsV0FBbkIsSUFBeUI7SUFIVCxDQVBsQjtJQVlBLHFCQUFBLEVBQXVCLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFDckIsVUFBQTtNQUFBLEtBQUEsR0FBUTtNQUNSLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7TUFDUCxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYO01BQ1YsSUFBRyxPQUFIO1FBQ0UsTUFBQSxHQUFTLE9BQVEsQ0FBQSxDQUFBO1FBQ2pCLFlBQUEsR0FBZSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUFBLEdBQTZCLE1BQU0sQ0FBQyxNQUFwQyxHQUE2QyxDQUFDLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTFCO2VBQzVELENBQUMsSUFBSSxLQUFKLENBQVUsY0FBYyxDQUFDLEdBQXpCLEVBQThCLFlBQTlCLENBQUQsRUFBNkMsTUFBTyxVQUFwRCxFQUhGO09BQUEsTUFBQTtlQUtFLENBQUMsY0FBRCxFQUFnQixFQUFoQixFQUxGOztJQUpxQixDQVp2Qjs7QUFoQkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxuc2NvcGVEaWN0aW9uYXJ5ID0ge1xuICAnY3BwJyAgICAgICAgICAgOiAnYysrJ1xuICAnYycgICAgICAgICAgICAgOiAnYycgLFxuICAnc291cmNlLmNwcCcgICAgOiAnYysrJyAsXG4gICdzb3VyY2UuYycgICAgICA6ICdjJyAsXG4gICdzb3VyY2Uub2JqYycgICA6ICdvYmplY3RpdmUtYycgLFxuICAnc291cmNlLm9iamNwcCcgOiAnb2JqZWN0aXZlLWMrKycgLFxuXG4gICMgRm9yIGJhY2t3YXJkLWNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBvZiBBdG9tIDwgMC4xNjZcbiAgJ3NvdXJjZS5jKysnICAgIDogJ2MrKycgLFxuICAnc291cmNlLm9iamMrKycgOiAnb2JqZWN0aXZlLWMrKycgLFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGdldEZpcnN0U2NvcGVzOiAoZWRpdG9yKSAtPlxuICAgIGVkaXRvci5nZXRDdXJzb3JzKClbMF0uZ2V0U2NvcGVEZXNjcmlwdG9yKCkuc2NvcGVzXG5cbiAgZ2V0U2NvcGVMYW5nOiAoc2NvcGVzKSAtPlxuICAgIGZvciBzY29wZSBpbiBzY29wZXNcbiAgICAgIHJldHVybiBzY29wZURpY3Rpb25hcnlbc2NvcGVdIGlmIHNjb3BlIG9mIHNjb3BlRGljdGlvbmFyeVxuXG4gIHByZWZpeEF0UG9zaXRpb246IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHJlZ2V4ID0gL1xcdyskL1xuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgbGluZS5tYXRjaChyZWdleCk/WzBdIG9yICcnXG5cbiAgbmVhcmVzdFN5bWJvbFBvc2l0aW9uOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICByZWdleCA9IC8oXFxXKylcXHcqJC9cbiAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuICAgIG1hdGNoZXMgPSBsaW5lLm1hdGNoKHJlZ2V4KVxuICAgIGlmIG1hdGNoZXNcbiAgICAgIHN5bWJvbCA9IG1hdGNoZXNbMV1cbiAgICAgIHN5bWJvbENvbHVtbiA9IG1hdGNoZXNbMF0uaW5kZXhPZihzeW1ib2wpICsgc3ltYm9sLmxlbmd0aCArIChsaW5lLmxlbmd0aCAtIG1hdGNoZXNbMF0ubGVuZ3RoKVxuICAgICAgW25ldyBQb2ludChidWZmZXJQb3NpdGlvbi5yb3csIHN5bWJvbENvbHVtbiksc3ltYm9sWy0xLi5dXVxuICAgIGVsc2VcbiAgICAgIFtidWZmZXJQb3NpdGlvbiwnJ11cbiJdfQ==
