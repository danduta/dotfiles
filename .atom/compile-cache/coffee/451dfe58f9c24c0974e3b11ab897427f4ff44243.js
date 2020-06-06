(function() {
  var ClangProvider, CompositeDisposable, Range, buildCodeCompletionArgs, getScopeLang, nearestSymbolPosition, path, prefixAtPosition, ref, ref1, ref2, spawnClang;

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable;

  path = require('path');

  ref1 = require('./clang-args-builder'), spawnClang = ref1.spawnClang, buildCodeCompletionArgs = ref1.buildCodeCompletionArgs;

  ref2 = require('./common-util'), getScopeLang = ref2.getScopeLang, prefixAtPosition = ref2.prefixAtPosition, nearestSymbolPosition = ref2.nearestSymbolPosition;

  module.exports = ClangProvider = (function() {
    function ClangProvider() {}

    ClangProvider.prototype.selector = 'c, cpp, .source.cpp, .source.c, .source.objc, .source.objcpp';

    ClangProvider.prototype.inclusionPriority = 1;

    ClangProvider.prototype.getSuggestions = function(arg1) {
      var bufferPosition, editor, language, lastSymbol, line, minimumWordLength, prefix, ref3, regex, scopeDescriptor, symbolPosition;
      editor = arg1.editor, scopeDescriptor = arg1.scopeDescriptor, bufferPosition = arg1.bufferPosition;
      language = getScopeLang(scopeDescriptor.getScopesArray());
      prefix = prefixAtPosition(editor, bufferPosition);
      ref3 = nearestSymbolPosition(editor, bufferPosition), symbolPosition = ref3[0], lastSymbol = ref3[1];
      minimumWordLength = atom.config.get('autocomplete-plus.minimumWordLength');
      if ((minimumWordLength != null) && prefix.length < minimumWordLength) {
        regex = /(?:\.|->|::)\s*\w*$/;
        line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        if (!regex.test(line)) {
          return;
        }
      }
      if (language != null) {
        return this.codeCompletionAt(editor, symbolPosition.row, symbolPosition.column, language, prefix);
      }
    };

    ClangProvider.prototype.codeCompletionAt = function(editor, row, column, language, prefix) {
      var args, cwd;
      cwd = path.dirname(editor.getPath());
      args = buildCodeCompletionArgs(editor, row, column, language);
      return spawnClang(cwd, args, editor.getText(), (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log(errors);
          return resolve(_this.handleCompletionResult(outputs, code, prefix));
        };
      })(this));
    };

    ClangProvider.prototype.convertCompletionLine = function(line, prefix) {
      var argumentsRe, basicInfo, basicInfoRe, comment, commentRe, completion, completionAndComment, constMemFuncRe, content, contentRe, index, infoTagsRe, isConstMemFunc, match, optionalArgumentsStart, ref3, ref4, ref5, returnType, returnTypeRe, suggestion;
      contentRe = /^COMPLETION: (.*)/;
      ref3 = line.match(contentRe), line = ref3[0], content = ref3[1];
      basicInfoRe = /^(.*?) : (.*)/;
      match = content.match(basicInfoRe);
      if (match == null) {
        return {
          text: content
        };
      }
      content = match[0], basicInfo = match[1], completionAndComment = match[2];
      commentRe = /(?: : (.*))?$/;
      ref4 = completionAndComment.split(commentRe), completion = ref4[0], comment = ref4[1];
      returnTypeRe = /^\[#(.*?)#\]/;
      returnType = (ref5 = completion.match(returnTypeRe)) != null ? ref5[1] : void 0;
      constMemFuncRe = /\[# const#\]$/;
      isConstMemFunc = constMemFuncRe.test(completion);
      infoTagsRe = /\[#(.*?)#\]/g;
      completion = completion.replace(infoTagsRe, '');
      argumentsRe = /<#(.*?)#>/g;
      optionalArgumentsStart = completion.indexOf('{#');
      completion = completion.replace(/\{#/g, '');
      completion = completion.replace(/#\}/g, '');
      index = 0;
      completion = completion.replace(argumentsRe, function(match, arg, offset) {
        index++;
        if (optionalArgumentsStart > 0 && offset > optionalArgumentsStart) {
          return "${" + index + ":optional " + arg + "}";
        } else {
          return "${" + index + ":" + arg + "}";
        }
      });
      suggestion = {};
      if (returnType != null) {
        suggestion.leftLabel = returnType;
      }
      if (index > 0) {
        suggestion.snippet = completion;
      } else {
        suggestion.text = completion;
      }
      if (isConstMemFunc) {
        suggestion.displayText = completion + ' const';
      }
      if (comment != null) {
        suggestion.description = comment;
      }
      suggestion.replacementPrefix = prefix;
      return suggestion;
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode, prefix) {
      var completionsRe, line, outputLines;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      completionsRe = new RegExp("^COMPLETION: (" + prefix + ".*)$", "mg");
      outputLines = result.match(completionsRe);
      if (outputLines != null) {
        return (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = outputLines.length; i < len; i++) {
            line = outputLines[i];
            results.push(this.convertCompletionLine(line, prefix));
          }
          return results;
        }).call(this);
      } else {
        return [];
      }
    };

    return ClangProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2NsYW5nLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtBQUFBLE1BQUE7O0VBQUEsTUFBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQyxpQkFBRCxFQUFROztFQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxPQUF3QyxPQUFBLENBQVEsc0JBQVIsQ0FBeEMsRUFBQyw0QkFBRCxFQUFhOztFQUNiLE9BQTBELE9BQUEsQ0FBUSxlQUFSLENBQTFELEVBQUMsZ0NBQUQsRUFBZSx3Q0FBZixFQUFpQzs7RUFFakMsTUFBTSxDQUFDLE9BQVAsR0FDTTs7OzRCQUNKLFFBQUEsR0FBVTs7NEJBQ1YsaUJBQUEsR0FBbUI7OzRCQUVuQixjQUFBLEdBQWdCLFNBQUMsSUFBRDtBQUNkLFVBQUE7TUFEZ0Isc0JBQVEsd0NBQWlCO01BQ3pDLFFBQUEsR0FBVyxZQUFBLENBQWEsZUFBZSxDQUFDLGNBQWhCLENBQUEsQ0FBYjtNQUNYLE1BQUEsR0FBUyxnQkFBQSxDQUFpQixNQUFqQixFQUF5QixjQUF6QjtNQUNULE9BQThCLHFCQUFBLENBQXNCLE1BQXRCLEVBQThCLGNBQTlCLENBQTlCLEVBQUMsd0JBQUQsRUFBZ0I7TUFDaEIsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQjtNQUVwQixJQUFHLDJCQUFBLElBQXVCLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLGlCQUExQztRQUNFLEtBQUEsR0FBUTtRQUNSLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7UUFDUCxJQUFBLENBQWMsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLENB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QUNFLFVBQVUsQ0FBQyxXQUFYLEdBQXlCLFVBQUEsR0FBYSxTQUR4Qzs7TUFFQSxJQUFvQyxlQUFwQztRQUFBLFVBQVUsQ0FBQyxXQUFYLEdBQXlCLFFBQXpCOztNQUNBLFVBQVUsQ0FBQyxpQkFBWCxHQUErQjthQUMvQjtJQXRDcUI7OzRCQXdDdkIsc0JBQUEsR0FBd0IsU0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixNQUFyQjtBQUN0QixVQUFBO01BQUEsSUFBRyxVQUFBLEtBQWMsQ0FBSSxDQUFyQjtRQUNFLElBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQWQ7QUFBQSxpQkFBQTtTQURGOztNQUlBLGFBQUEsR0FBZ0IsSUFBSSxNQUFKLENBQVcsZ0JBQUEsR0FBbUIsTUFBbkIsR0FBNEIsTUFBdkMsRUFBK0MsSUFBL0M7TUFDaEIsV0FBQSxHQUFjLE1BQU0sQ0FBQyxLQUFQLENBQWEsYUFBYjtNQUVkLElBQUcsbUJBQUg7QUFDRTs7QUFBUTtlQUFBLDZDQUFBOzt5QkFBQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBdkIsRUFBNkIsTUFBN0I7QUFBQTs7c0JBRFY7T0FBQSxNQUFBO0FBR0UsZUFBTyxHQUhUOztJQVJzQjs7Ozs7QUF2RTFCIiwic291cmNlc0NvbnRlbnQiOlsiIyBhdXRvY29tcGxldGUtcGx1cyBwcm92aWRlciBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Jlbm9nbGUvYXV0b2NvbXBsZXRlLWNsYW5nXG4jIENvcHlyaWdodCAoYykgMjAxNSBCZW4gT2dsZSB1bmRlciBNSVQgbGljZW5zZVxuIyBDbGFuZyByZWxhdGVkIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20veWFzdXl1a3kvYXV0b2NvbXBsZXRlLWNsYW5nXG5cbntSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57c3Bhd25DbGFuZywgYnVpbGRDb2RlQ29tcGxldGlvbkFyZ3N9ID0gcmVxdWlyZSAnLi9jbGFuZy1hcmdzLWJ1aWxkZXInXG57Z2V0U2NvcGVMYW5nLCBwcmVmaXhBdFBvc2l0aW9uLCBuZWFyZXN0U3ltYm9sUG9zaXRpb259ID0gcmVxdWlyZSAnLi9jb21tb24tdXRpbCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2xhbmdQcm92aWRlclxuICBzZWxlY3RvcjogJ2MsIGNwcCwgLnNvdXJjZS5jcHAsIC5zb3VyY2UuYywgLnNvdXJjZS5vYmpjLCAuc291cmNlLm9iamNwcCdcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDFcblxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIHNjb3BlRGVzY3JpcHRvciwgYnVmZmVyUG9zaXRpb259KSAtPlxuICAgIGxhbmd1YWdlID0gZ2V0U2NvcGVMYW5nIHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgcHJlZml4ID0gcHJlZml4QXRQb3NpdGlvbihlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgIFtzeW1ib2xQb3NpdGlvbixsYXN0U3ltYm9sXSA9IG5lYXJlc3RTeW1ib2xQb3NpdGlvbihlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgIG1pbmltdW1Xb3JkTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGx1cy5taW5pbXVtV29yZExlbmd0aCcpXG5cbiAgICBpZiBtaW5pbXVtV29yZExlbmd0aD8gYW5kIHByZWZpeC5sZW5ndGggPCBtaW5pbXVtV29yZExlbmd0aFxuICAgICAgcmVnZXggPSAvKD86XFwufC0+fDo6KVxccypcXHcqJC9cbiAgICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgICByZXR1cm4gdW5sZXNzIHJlZ2V4LnRlc3QobGluZSlcblxuICAgIGlmIGxhbmd1YWdlP1xuICAgICAgQGNvZGVDb21wbGV0aW9uQXQoZWRpdG9yLCBzeW1ib2xQb3NpdGlvbi5yb3csIHN5bWJvbFBvc2l0aW9uLmNvbHVtbiwgbGFuZ3VhZ2UsIHByZWZpeClcblxuICBjb2RlQ29tcGxldGlvbkF0OiAoZWRpdG9yLCByb3csIGNvbHVtbiwgbGFuZ3VhZ2UsIHByZWZpeCkgLT5cbiAgICBjd2QgPSBwYXRoLmRpcm5hbWUgZWRpdG9yLmdldFBhdGgoKVxuICAgIGFyZ3MgPSBidWlsZENvZGVDb21wbGV0aW9uQXJncyBlZGl0b3IsIHJvdywgY29sdW1uLCBsYW5ndWFnZVxuICAgIHNwYXduQ2xhbmcgY3dkLCBhcmdzLCBlZGl0b3IuZ2V0VGV4dCgpLCAoY29kZSwgb3V0cHV0cywgZXJyb3JzLCByZXNvbHZlKSA9PlxuICAgICAgY29uc29sZS5sb2cgZXJyb3JzXG4gICAgICByZXNvbHZlKEBoYW5kbGVDb21wbGV0aW9uUmVzdWx0KG91dHB1dHMsIGNvZGUsIHByZWZpeCkpXG5cbiAgY29udmVydENvbXBsZXRpb25MaW5lOiAobGluZSwgcHJlZml4KSAtPlxuICAgIGNvbnRlbnRSZSA9IC9eQ09NUExFVElPTjogKC4qKS9cbiAgICBbbGluZSwgY29udGVudF0gPSBsaW5lLm1hdGNoIGNvbnRlbnRSZVxuICAgIGJhc2ljSW5mb1JlID0gL14oLio/KSA6ICguKikvXG4gICAgbWF0Y2ggPSBjb250ZW50Lm1hdGNoIGJhc2ljSW5mb1JlXG4gICAgcmV0dXJuIHt0ZXh0OiBjb250ZW50fSB1bmxlc3MgbWF0Y2g/XG5cbiAgICBbY29udGVudCwgYmFzaWNJbmZvLCBjb21wbGV0aW9uQW5kQ29tbWVudF0gPSBtYXRjaFxuICAgIGNvbW1lbnRSZSA9IC8oPzogOiAoLiopKT8kL1xuICAgIFtjb21wbGV0aW9uLCBjb21tZW50XSA9IGNvbXBsZXRpb25BbmRDb21tZW50LnNwbGl0IGNvbW1lbnRSZVxuICAgIHJldHVyblR5cGVSZSA9IC9eXFxbIyguKj8pI1xcXS9cbiAgICByZXR1cm5UeXBlID0gY29tcGxldGlvbi5tYXRjaChyZXR1cm5UeXBlUmUpP1sxXVxuICAgIGNvbnN0TWVtRnVuY1JlID0gL1xcWyMgY29uc3QjXFxdJC9cbiAgICBpc0NvbnN0TWVtRnVuYyA9IGNvbnN0TWVtRnVuY1JlLnRlc3QgY29tcGxldGlvblxuICAgIGluZm9UYWdzUmUgPSAvXFxbIyguKj8pI1xcXS9nXG4gICAgY29tcGxldGlvbiA9IGNvbXBsZXRpb24ucmVwbGFjZSBpbmZvVGFnc1JlLCAnJ1xuICAgIGFyZ3VtZW50c1JlID0gLzwjKC4qPykjPi9nXG4gICAgb3B0aW9uYWxBcmd1bWVudHNTdGFydCA9IGNvbXBsZXRpb24uaW5kZXhPZiAneyMnXG4gICAgY29tcGxldGlvbiA9IGNvbXBsZXRpb24ucmVwbGFjZSAvXFx7Iy9nLCAnJ1xuICAgIGNvbXBsZXRpb24gPSBjb21wbGV0aW9uLnJlcGxhY2UgLyNcXH0vZywgJydcbiAgICBpbmRleCA9IDBcbiAgICBjb21wbGV0aW9uID0gY29tcGxldGlvbi5yZXBsYWNlIGFyZ3VtZW50c1JlLCAobWF0Y2gsIGFyZywgb2Zmc2V0KSAtPlxuICAgICAgaW5kZXgrK1xuICAgICAgaWYgb3B0aW9uYWxBcmd1bWVudHNTdGFydCA+IDAgYW5kIG9mZnNldCA+IG9wdGlvbmFsQXJndW1lbnRzU3RhcnRcbiAgICAgICAgcmV0dXJuIFwiJHsje2luZGV4fTpvcHRpb25hbCAje2FyZ319XCJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIFwiJHsje2luZGV4fToje2FyZ319XCJcblxuICAgIHN1Z2dlc3Rpb24gPSB7fVxuICAgIHN1Z2dlc3Rpb24ubGVmdExhYmVsID0gcmV0dXJuVHlwZSBpZiByZXR1cm5UeXBlP1xuICAgIGlmIGluZGV4ID4gMFxuICAgICAgc3VnZ2VzdGlvbi5zbmlwcGV0ID0gY29tcGxldGlvblxuICAgIGVsc2VcbiAgICAgIHN1Z2dlc3Rpb24udGV4dCA9IGNvbXBsZXRpb25cbiAgICBpZiBpc0NvbnN0TWVtRnVuY1xuICAgICAgc3VnZ2VzdGlvbi5kaXNwbGF5VGV4dCA9IGNvbXBsZXRpb24gKyAnIGNvbnN0J1xuICAgIHN1Z2dlc3Rpb24uZGVzY3JpcHRpb24gPSBjb21tZW50IGlmIGNvbW1lbnQ/XG4gICAgc3VnZ2VzdGlvbi5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgIHN1Z2dlc3Rpb25cblxuICBoYW5kbGVDb21wbGV0aW9uUmVzdWx0OiAocmVzdWx0LCByZXR1cm5Db2RlLCBwcmVmaXgpIC0+XG4gICAgaWYgcmV0dXJuQ29kZSBpcyBub3QgMFxuICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaWdub3JlQ2xhbmdFcnJvcnNcIlxuICAgICMgRmluZCBhbGwgY29tcGxldGlvbnMgdGhhdCBtYXRjaCBvdXIgcHJlZml4IGluIE9ORSByZWdleFxuICAgICMgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG4gICAgY29tcGxldGlvbnNSZSA9IG5ldyBSZWdFeHAoXCJeQ09NUExFVElPTjogKFwiICsgcHJlZml4ICsgXCIuKikkXCIsIFwibWdcIilcbiAgICBvdXRwdXRMaW5lcyA9IHJlc3VsdC5tYXRjaChjb21wbGV0aW9uc1JlKVxuXG4gICAgaWYgb3V0cHV0TGluZXM/XG4gICAgICByZXR1cm4gKEBjb252ZXJ0Q29tcGxldGlvbkxpbmUobGluZSwgcHJlZml4KSBmb3IgbGluZSBpbiBvdXRwdXRMaW5lcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW11cbiJdfQ==
