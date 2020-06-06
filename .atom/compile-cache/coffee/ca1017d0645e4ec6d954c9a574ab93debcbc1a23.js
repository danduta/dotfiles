(function() {
  var buildEmitPchArgs, getFirstScopes, getScopeLang, path, ref, ref1, spawnClang;

  path = require('path');

  ref = require('./common-util'), getFirstScopes = ref.getFirstScopes, getScopeLang = ref.getScopeLang;

  ref1 = require('./clang-args-builder'), spawnClang = ref1.spawnClang, buildEmitPchArgs = ref1.buildEmitPchArgs;

  module.exports = {
    emitPch: function(editor) {
      var args, cwd, h, headers, headersInput, lang;
      lang = getScopeLang(getFirstScopes(editor));
      if (!lang) {
        atom.notifications.addError("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders " + lang);
      headersInput = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = headers.length; i < len; i++) {
          h = headers[i];
          results.push("#include <" + h + ">");
        }
        return results;
      })()).join("\n");
      cwd = path.dirname(editor.getPath());
      args = buildEmitPchArgs(editor, lang);
      return spawnClang(cwd, args, headersInput, (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log("-emit-pch out\n", outputs);
          console.log("-emit-pch err\n", errors);
          return resolve(_this.handleEmitPchResult(code));
        };
      })(this));
    },
    handleEmitPchResult: function(code) {
      if (!code) {
        atom.notifications.addSuccess("Emiting precompiled header has successfully finished");
        return;
      }
      return atom.notifications.addError(("Emiting precompiled header exit with " + code + "\n") + "See console for detailed error message");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL3BjaC1lbWl0dGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQWlDLE9BQUEsQ0FBUSxlQUFSLENBQWpDLEVBQUMsbUNBQUQsRUFBaUI7O0VBQ2pCLE9BQWtDLE9BQUEsQ0FBUSxzQkFBUixDQUFsQyxFQUFDLDRCQUFELEVBQWE7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxTQUFDLE1BQUQ7QUFDUCxVQUFBO01BQUEsSUFBQSxHQUFPLFlBQUEsQ0FBYyxjQUFBLENBQWUsTUFBZixDQUFkO01BQ1AsSUFBQSxDQUFPLElBQVA7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLDJEQUE1QjtBQUNBLGVBRkY7O01BR0EsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBQSxHQUF5QyxJQUF6RDtNQUNWLFlBQUEsR0FBZTs7QUFBQzthQUFBLHlDQUFBOzt1QkFBQSxZQUFBLEdBQWEsQ0FBYixHQUFlO0FBQWY7O1VBQUQsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxJQUExQztNQUNmLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBYjtNQUNOLElBQUEsR0FBTyxnQkFBQSxDQUFpQixNQUFqQixFQUF5QixJQUF6QjthQUNQLFVBQUEsQ0FBVyxHQUFYLEVBQWdCLElBQWhCLEVBQXNCLFlBQXRCLEVBQW9DLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixNQUFoQixFQUF3QixPQUF4QjtVQUNsQyxPQUFPLENBQUMsR0FBUixDQUFZLGlCQUFaLEVBQStCLE9BQS9CO1VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQixNQUEvQjtpQkFDQSxPQUFBLENBQVEsS0FBQyxDQUFBLG1CQUFELENBQXFCLElBQXJCLENBQVI7UUFIa0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDO0lBVE8sQ0FBVDtJQWNBLG1CQUFBLEVBQXFCLFNBQUMsSUFBRDtNQUNuQixJQUFBLENBQU8sSUFBUDtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsc0RBQTlCO0FBQ0EsZUFGRjs7YUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLENBQUEsdUNBQUEsR0FBd0MsSUFBeEMsR0FBNkMsSUFBN0MsQ0FBQSxHQUMxQix3Q0FERjtJQUptQixDQWRyQjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG57Z2V0Rmlyc3RTY29wZXMsIGdldFNjb3BlTGFuZ30gPSByZXF1aXJlICcuL2NvbW1vbi11dGlsJ1xue3NwYXduQ2xhbmcsIGJ1aWxkRW1pdFBjaEFyZ3N9ICA9IHJlcXVpcmUgJy4vY2xhbmctYXJncy1idWlsZGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGVtaXRQY2g6IChlZGl0b3IpLT5cbiAgICBsYW5nID0gZ2V0U2NvcGVMYW5nIChnZXRGaXJzdFNjb3BlcyBlZGl0b3IpXG4gICAgdW5sZXNzIGxhbmdcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcImF1dG9jb21wbGV0ZS1jbGFuZzplbWl0LXBjaFxcbkVycm9yOiBJbmNvbXBhdGlibGUgTGFuZ3VhZ2VcIlxuICAgICAgcmV0dXJuXG4gICAgaGVhZGVycyA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5wcmVDb21waWxlZEhlYWRlcnMgI3tsYW5nfVwiXG4gICAgaGVhZGVyc0lucHV0ID0gKFwiI2luY2x1ZGUgPCN7aH0+XCIgZm9yIGggaW4gaGVhZGVycykuam9pbiBcIlxcblwiXG4gICAgY3dkID0gcGF0aC5kaXJuYW1lIGVkaXRvci5nZXRQYXRoKClcbiAgICBhcmdzID0gYnVpbGRFbWl0UGNoQXJncyBlZGl0b3IsIGxhbmdcbiAgICBzcGF3bkNsYW5nIGN3ZCwgYXJncywgaGVhZGVyc0lucHV0LCAoY29kZSwgb3V0cHV0cywgZXJyb3JzLCByZXNvbHZlKSA9PlxuICAgICAgY29uc29sZS5sb2cgXCItZW1pdC1wY2ggb3V0XFxuXCIsIG91dHB1dHNcbiAgICAgIGNvbnNvbGUubG9nIFwiLWVtaXQtcGNoIGVyclxcblwiLCBlcnJvcnNcbiAgICAgIHJlc29sdmUoQGhhbmRsZUVtaXRQY2hSZXN1bHQgY29kZSlcblxuICBoYW5kbGVFbWl0UGNoUmVzdWx0OiAoY29kZSktPlxuICAgIHVubGVzcyBjb2RlXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyBcIkVtaXRpbmcgcHJlY29tcGlsZWQgaGVhZGVyIGhhcyBzdWNjZXNzZnVsbHkgZmluaXNoZWRcIlxuICAgICAgcmV0dXJuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiRW1pdGluZyBwcmVjb21waWxlZCBoZWFkZXIgZXhpdCB3aXRoICN7Y29kZX1cXG5cIitcbiAgICAgIFwiU2VlIGNvbnNvbGUgZm9yIGRldGFpbGVkIGVycm9yIG1lc3NhZ2VcIlxuIl19
