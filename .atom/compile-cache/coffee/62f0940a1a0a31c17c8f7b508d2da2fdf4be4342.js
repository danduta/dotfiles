(function() {
  var defaultPrecompiled;

  defaultPrecompiled = require('./default-precompiled');

  module.exports = {
    clangCommand: {
      type: 'string',
      "default": 'clang'
    },
    includePaths: {
      type: 'array',
      "default": ['.'],
      items: {
        type: 'string'
      }
    },
    pchFilePrefix: {
      type: 'string',
      "default": '.stdafx'
    },
    ignoreClangErrors: {
      type: 'boolean',
      "default": true
    },
    includeDocumentation: {
      type: 'boolean',
      "default": true
    },
    includeSystemHeadersDocumentation: {
      type: 'boolean',
      "default": false,
      description: "**WARNING**: if there are any PCHs compiled without this option," + "you will have to delete them and generate them again"
    },
    includeNonDoxygenCommentsAsDocumentation: {
      type: 'boolean',
      "default": false
    },
    "std c++": {
      type: 'string',
      "default": "c++14"
    },
    "std c": {
      type: 'string',
      "default": "c99"
    },
    "preCompiledHeaders c++": {
      type: 'array',
      "default": defaultPrecompiled.cpp,
      item: {
        type: 'string'
      }
    },
    "preCompiledHeaders c": {
      type: 'array',
      "default": defaultPrecompiled.c,
      items: {
        type: 'string'
      }
    },
    "preCompiledHeaders objective-c": {
      type: 'array',
      "default": defaultPrecompiled.objc,
      items: {
        type: 'string'
      }
    },
    "preCompiledHeaders objective-c++": {
      type: 'array',
      "default": defaultPrecompiled.objcpp,
      items: {
        type: 'string'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2NvbmZpZ3VyYXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE9BRFQ7S0FERjtJQUdBLFlBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxPQUFOO01BQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLEdBQUQsQ0FEVDtNQUVBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO09BSEY7S0FKRjtJQVFBLGFBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxRQUFOO01BQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQURUO0tBVEY7SUFXQSxpQkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFNBQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7S0FaRjtJQWNBLG9CQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sU0FBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtLQWZGO0lBaUJBLGlDQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sU0FBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtNQUVBLFdBQUEsRUFDRSxrRUFBQSxHQUNBLHNEQUpGO0tBbEJGO0lBdUJBLHdDQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sU0FBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtLQXhCRjtJQTBCQSxTQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtLQTNCRjtJQTZCQSxPQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtLQTlCRjtJQWdDQSx3QkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLE9BQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLEdBRDVCO01BRUEsSUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47T0FIRjtLQWpDRjtJQXFDQSxzQkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLE9BQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLENBRDVCO01BRUEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47T0FIRjtLQXRDRjtJQTBDQSxnQ0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLE9BQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLElBRDVCO01BRUEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47T0FIRjtLQTNDRjtJQStDQSxrQ0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLE9BQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLE1BRDVCO01BRUEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47T0FIRjtLQWhERjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbImRlZmF1bHRQcmVjb21waWxlZCA9IHJlcXVpcmUgJy4vZGVmYXVsdC1wcmVjb21waWxlZCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFuZ0NvbW1hbmQ6XG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnY2xhbmcnXG4gIGluY2x1ZGVQYXRoczpcbiAgICB0eXBlOiAnYXJyYXknXG4gICAgZGVmYXVsdDogWycuJ11cbiAgICBpdGVtczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gIHBjaEZpbGVQcmVmaXg6XG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnLnN0ZGFmeCdcbiAgaWdub3JlQ2xhbmdFcnJvcnM6XG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogdHJ1ZVxuICBpbmNsdWRlRG9jdW1lbnRhdGlvbjpcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gIGluY2x1ZGVTeXN0ZW1IZWFkZXJzRG9jdW1lbnRhdGlvbjpcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgXCIqKldBUk5JTkcqKjogaWYgdGhlcmUgYXJlIGFueSBQQ0hzIGNvbXBpbGVkIHdpdGhvdXQgdGhpcyBvcHRpb24sXCIrXG4gICAgICBcInlvdSB3aWxsIGhhdmUgdG8gZGVsZXRlIHRoZW0gYW5kIGdlbmVyYXRlIHRoZW0gYWdhaW5cIlxuICBpbmNsdWRlTm9uRG94eWdlbkNvbW1lbnRzQXNEb2N1bWVudGF0aW9uOlxuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIFwic3RkIGMrK1wiOlxuICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgZGVmYXVsdDogXCJjKysxNFwiXG4gIFwic3RkIGNcIjpcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6IFwiYzk5XCJcbiAgXCJwcmVDb21waWxlZEhlYWRlcnMgYysrXCI6XG4gICAgdHlwZTogJ2FycmF5J1xuICAgIGRlZmF1bHQ6IGRlZmF1bHRQcmVjb21waWxlZC5jcHBcbiAgICBpdGVtOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgXCJwcmVDb21waWxlZEhlYWRlcnMgY1wiOlxuICAgIHR5cGU6ICdhcnJheSdcbiAgICBkZWZhdWx0OiBkZWZhdWx0UHJlY29tcGlsZWQuY1xuICAgIGl0ZW1zOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgXCJwcmVDb21waWxlZEhlYWRlcnMgb2JqZWN0aXZlLWNcIjpcbiAgICB0eXBlOiAnYXJyYXknXG4gICAgZGVmYXVsdDogZGVmYXVsdFByZWNvbXBpbGVkLm9iamNcbiAgICBpdGVtczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gIFwicHJlQ29tcGlsZWRIZWFkZXJzIG9iamVjdGl2ZS1jKytcIjpcbiAgICB0eXBlOiAnYXJyYXknXG4gICAgZGVmYXVsdDogZGVmYXVsdFByZWNvbXBpbGVkLm9iamNwcFxuICAgIGl0ZW1zOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiJdfQ==
