(function() {
  var File, SelectList, buildAstDumpArgs, getFirstScopes, getScopeLang, path, ref, ref1, spawnClang;

  File = require('atom').File;

  path = require('path');

  SelectList = require('atom-select-list');

  ref = require('./common-util'), getFirstScopes = ref.getFirstScopes, getScopeLang = ref.getScopeLang;

  ref1 = require('./clang-args-builder'), spawnClang = ref1.spawnClang, buildAstDumpArgs = ref1.buildAstDumpArgs;

  module.exports = {
    goDeclaration: function(editor, e) {
      var args, cwd, lang, term;
      lang = getScopeLang(getFirstScopes(editor));
      if (!lang) {
        e.abortKeyBinding();
        return;
      }
      editor.selectWordsContainingCursors();
      term = editor.getSelectedText();
      cwd = path.dirname(editor.getPath());
      args = buildAstDumpArgs(editor, lang, term);
      return spawnClang(cwd, args, editor.getText(), (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log("GoDecl err\n", errors);
          return resolve(_this.handleAstDumpResult(editor, {
            output: outputs,
            term: term
          }, code));
        };
      })(this));
    },
    handleAstDumpResult: function(editor, result, returnCode) {
      var declList, places;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      places = this.parseAstDump(result.output, result.term);
      if (places.length === 1) {
        return this.jumpToLocation(editor, places.pop());
      } else if (places.length > 1) {
        declList = this.createDeclList(editor, places);
        this.lastFocusedElement = document.activeElement;
        this.panel = atom.workspace.addModalPanel({
          item: declList
        });
        return declList.focus();
      }
    },
    createDeclList: function(editor, places) {
      return new SelectList({
        items: places,
        elementForItem: function(item) {
          var element, f;
          element = document.createElement('li');
          if (item[0] === '<stdin>') {
            element.innerHTML = item[1] + ":" + item[2];
          } else {
            f = path.join(item[0]);
            element.innerHTML(f + "  " + item[1] + ":" + item[2]);
          }
          return element;
        },
        filterKeyForItem: function(item) {
          return item.label;
        },
        didConfirmSelection: (function(_this) {
          return function(item) {
            _this.hideDeclList();
            return _this.jumpToLocation(editor, item);
          };
        })(this),
        didCancelSelection: (function(_this) {
          return function() {
            return _this.hideDeclList();
          };
        })(this)
      });
    },
    hideDeclList: function() {
      if (this.panel && this.panel.destroy) {
        this.panel.destroy();
      }
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        return this.lastFocusedElement = null;
      }
    },
    jumpToLocation: function(editor, arg) {
      var col, f, file, line;
      file = arg[0], line = arg[1], col = arg[2];
      if (file === '<stdin>') {
        return editor.setCursorBufferPosition([line - 1, col - 1]);
      }
      if (file.startsWith(".")) {
        file = path.join(editor.getDirectoryPath(), file);
      }
      f = new File(file);
      return f.exists().then(function(result) {
        if (result) {
          return atom.workspace.open(file, {
            initialLine: line - 1,
            initialColumn: col - 1
          });
        }
      });
    },
    parseAstDump: function(aststring, term) {
      var _, candidate, candidates, col, declRangeStr, declTerms, escapedTerm, file, i, len, line, lines, match, places, posStr, positions, ref2, ref3;
      candidates = aststring.split('\n\n');
      places = [];
      escapedTerm = term.match(/[A-Za-z_][A-Za-z0-9_]*/);
      if (escapedTerm === null) {
        return [];
      }
      for (i = 0, len = candidates.length; i < len; i++) {
        candidate = candidates[i];
        match = candidate.match(RegExp("^Dumping\\s(?:[A-Za-z_]*::)*?" + escapedTerm + ":"));
        if (match !== null) {
          lines = candidate.split('\n');
          if (lines.length < 2) {
            continue;
          }
          declTerms = lines[1].split(' ');
          _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          while (!declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/)) {
            if (declTerms.length < 5) {
              break;
            }
            declTerms = declTerms.slice(2);
            _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          }
          if (declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/)) {
            ref2 = declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/), _ = ref2[0], file = ref2[1], line = ref2[2], col = ref2[3];
            positions = posStr.match(/(line|col):([0-9]+)(?::([0-9]+))?/);
            if (positions) {
              if (positions[1] === 'line') {
                ref3 = [positions[2], positions[3]], line = ref3[0], col = ref3[1];
              } else {
                col = positions[2];
              }
              places.push([file, Number(line), Number(col)]);
            }
          }
        }
      }
      return places;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2p1bXBlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLE9BQVEsT0FBQSxDQUFRLE1BQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0VBRWIsTUFBaUMsT0FBQSxDQUFRLGVBQVIsQ0FBakMsRUFBQyxtQ0FBRCxFQUFpQjs7RUFDakIsT0FBaUMsT0FBQSxDQUFRLHNCQUFSLENBQWpDLEVBQUMsNEJBQUQsRUFBYTs7RUFHYixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLFNBQUMsTUFBRCxFQUFRLENBQVI7QUFDYixVQUFBO01BQUEsSUFBQSxHQUFPLFlBQUEsQ0FBYyxjQUFBLENBQWUsTUFBZixDQUFkO01BQ1AsSUFBQSxDQUFPLElBQVA7UUFDRSxDQUFDLENBQUMsZUFBRixDQUFBO0FBQ0EsZUFGRjs7TUFHQSxNQUFNLENBQUMsNEJBQVAsQ0FBQTtNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBO01BQ1AsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFiO01BQ04sSUFBQSxHQUFPLGdCQUFBLENBQWlCLE1BQWpCLEVBQXlCLElBQXpCLEVBQStCLElBQS9CO2FBQ1AsVUFBQSxDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsRUFBc0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUF0QixFQUF3QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsTUFBaEIsRUFBd0IsT0FBeEI7VUFDdEMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxjQUFaLEVBQTRCLE1BQTVCO2lCQUNBLE9BQUEsQ0FBUSxLQUFDLENBQUEs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LENBQTNCO0FBQUEscUJBQUE7O1VBQ0EsU0FBQSxHQUFZLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFULENBQWUsR0FBZjtVQUNYLGdCQUFELEVBQUcsZ0JBQUgsRUFBSywyQkFBTCxFQUFrQixnQkFBbEIsRUFBb0I7QUFDcEIsaUJBQU0sQ0FBSSxZQUFZLENBQUMsS0FBYixDQUFtQiwwQkFBbkIsQ0FBVjtZQUNFLElBQVMsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBNUI7QUFBQSxvQkFBQTs7WUFDQSxTQUFBLEdBQVksU0FBVTtZQUNyQixnQkFBRCxFQUFHLGdCQUFILEVBQUssMkJBQUwsRUFBa0IsZ0JBQWxCLEVBQW9CO1VBSHRCO1VBSUEsSUFBRyxZQUFZLENBQUMsS0FBYixDQUFtQiwwQkFBbkIsQ0FBSDtZQUNFLE9BQW9CLFlBQVksQ0FBQyxLQUFiLENBQW1CLDBCQUFuQixDQUFwQixFQUFDLFdBQUQsRUFBRyxjQUFILEVBQVEsY0FBUixFQUFhO1lBQ2IsU0FBQSxHQUFZLE1BQU0sQ0FBQyxLQUFQLENBQWEsbUNBQWI7WUFDWixJQUFHLFNBQUg7Y0FDRSxJQUFHLFNBQVUsQ0FBQSxDQUFBLENBQVYsS0FBZ0IsTUFBbkI7Z0JBQ0UsT0FBYSxDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQVgsRUFBZSxTQUFVLENBQUEsQ0FBQSxDQUF6QixDQUFiLEVBQUMsY0FBRCxFQUFNLGNBRFI7ZUFBQSxNQUFBO2dCQUdFLEdBQUEsR0FBTSxTQUFVLENBQUEsQ0FBQSxFQUhsQjs7Y0FJQSxNQUFNLENBQUMsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLE1BQUEsQ0FBTyxJQUFQLENBQVAsRUFBcUIsTUFBQSxDQUFPLEdBQVAsQ0FBckIsQ0FBWixFQUxGO2FBSEY7V0FURjs7QUFGRjtBQW9CQSxhQUFPO0lBekJLLENBMURkOztBQVRGIiwic291cmNlc0NvbnRlbnQiOlsie0ZpbGV9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuU2VsZWN0TGlzdCA9IHJlcXVpcmUgJ2F0b20tc2VsZWN0LWxpc3QnXG5cbntnZXRGaXJzdFNjb3BlcywgZ2V0U2NvcGVMYW5nfSA9IHJlcXVpcmUgJy4vY29tbW9uLXV0aWwnXG57c3Bhd25DbGFuZywgYnVpbGRBc3REdW1wQXJnc30gPSByZXF1aXJlICcuL2NsYW5nLWFyZ3MtYnVpbGRlcidcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGdvRGVjbGFyYXRpb246IChlZGl0b3IsZSktPlxuICAgIGxhbmcgPSBnZXRTY29wZUxhbmcgKGdldEZpcnN0U2NvcGVzIGVkaXRvcilcbiAgICB1bmxlc3MgbGFuZ1xuICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuICAgICAgcmV0dXJuXG4gICAgZWRpdG9yLnNlbGVjdFdvcmRzQ29udGFpbmluZ0N1cnNvcnMoKVxuICAgIHRlcm0gPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBjd2QgPSBwYXRoLmRpcm5hbWUgZWRpdG9yLmdldFBhdGgoKVxuICAgIGFyZ3MgPSBidWlsZEFzdER1bXBBcmdzIGVkaXRvciwgbGFuZywgdGVybVxuICAgIHNwYXduQ2xhbmcgY3dkLCBhcmdzLCBlZGl0b3IuZ2V0VGV4dCgpLCAoY29kZSwgb3V0cHV0cywgZXJyb3JzLCByZXNvbHZlKSA9PlxuICAgICAgY29uc29sZS5sb2cgXCJHb0RlY2wgZXJyXFxuXCIsIGVycm9yc1xuICAgICAgcmVzb2x2ZShAaGFuZGxlQXN0RHVtcFJlc3VsdCBlZGl0b3IsIHtvdXRwdXQ6b3V0cHV0cywgdGVybTp0ZXJtfSwgY29kZSlcblxuICBoYW5kbGVBc3REdW1wUmVzdWx0OiAoZWRpdG9yLCByZXN1bHQsIHJldHVybkNvZGUpLT5cbiAgICBpZiByZXR1cm5Db2RlIGlzIG5vdCAwXG4gICAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pZ25vcmVDbGFuZ0Vycm9yc1wiXG4gICAgcGxhY2VzID0gQHBhcnNlQXN0RHVtcCByZXN1bHQub3V0cHV0LCByZXN1bHQudGVybVxuICAgIGlmIHBsYWNlcy5sZW5ndGggaXMgMVxuICAgICAgQGp1bXBUb0xvY2F0aW9uIGVkaXRvciwgcGxhY2VzLnBvcCgpXG4gICAgZWxzZSBpZiBwbGFjZXMubGVuZ3RoID4gMVxuICAgICAgZGVjbExpc3QgPSBAY3JlYXRlRGVjbExpc3QgZWRpdG9yLCBwbGFjZXNcbiAgICAgIEBsYXN0Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICBAcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsIGl0ZW06IGRlY2xMaXN0XG4gICAgICBkZWNsTGlzdC5mb2N1cygpXG5cbiAgY3JlYXRlRGVjbExpc3Q6IChlZGl0b3IsIHBsYWNlcykgLT5cbiAgICBuZXcgU2VsZWN0TGlzdFxuICAgICAgaXRlbXM6IHBsYWNlc1xuICAgICAgZWxlbWVudEZvckl0ZW06IChpdGVtKSAtPlxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBpZiBpdGVtWzBdIGlzICc8c3RkaW4+J1xuICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCIje2l0ZW1bMV19OiN7aXRlbVsyXX1cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgZiA9IHBhdGguam9pbihpdGVtWzBdKVxuICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MIFwiI3tmfSAgI3tpdGVtWzFdfToje2l0ZW1bMl19XCJcbiAgICAgICAgZWxlbWVudFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogKGl0ZW0pIC0+IGl0ZW0ubGFiZWwsXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiAoaXRlbSkgPT5cbiAgICAgICAgQGhpZGVEZWNsTGlzdCgpXG4gICAgICAgIEBqdW1wVG9Mb2NhdGlvbiBlZGl0b3IsIGl0ZW1cbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT5cbiAgICAgICAgQGhpZGVEZWNsTGlzdCgpXG5cbiAgaGlkZURlY2xMaXN0OiAoKS0+XG4gICAgaWYgQHBhbmVsIGFuZCBAcGFuZWwuZGVzdHJveVxuICAgICAgQHBhbmVsLmRlc3Ryb3koKVxuICAgIGlmIEBsYXN0Rm9jdXNlZEVsZW1lbnRcbiAgICAgIEBsYXN0Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuICAgICAgQGxhc3RGb2N1c2VkRWxlbWVudCA9IG51bGxcblxuICBqdW1wVG9Mb2NhdGlvbjogKGVkaXRvciwgW2ZpbGUsbGluZSxjb2xdKSAtPlxuICAgIGlmIGZpbGUgaXMgJzxzdGRpbj4nXG4gICAgICByZXR1cm4gZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFtsaW5lLTEsY29sLTFdXG4gICAgZmlsZSA9IHBhdGguam9pbiBlZGl0b3IuZ2V0RGlyZWN0b3J5UGF0aCgpLCBmaWxlIGlmIGZpbGUuc3RhcnRzV2l0aChcIi5cIilcbiAgICBmID0gbmV3IEZpbGUgZmlsZVxuICAgIGYuZXhpc3RzKCkudGhlbiAocmVzdWx0KSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlLCB7aW5pdGlhbExpbmU6bGluZS0xLCBpbml0aWFsQ29sdW1uOmNvbC0xfSBpZiByZXN1bHRcblxuICBwYXJzZUFzdER1bXA6IChhc3RzdHJpbmcsIHRlcm0pLT5cbiAgICBjYW5kaWRhdGVzID0gYXN0c3RyaW5nLnNwbGl0ICdcXG5cXG4nXG4gICAgcGxhY2VzID0gW11cbiAgICBlc2NhcGVkVGVybSA9IHRlcm0ubWF0Y2ggL1tBLVphLXpfXVtBLVphLXowLTlfXSovXG4gICAgcmV0dXJuIFtdIGlmIGVzY2FwZWRUZXJtIGlzIG51bGxcbiAgICBmb3IgY2FuZGlkYXRlIGluIGNhbmRpZGF0ZXNcbiAgICAgIG1hdGNoID0gY2FuZGlkYXRlLm1hdGNoIC8vL15EdW1waW5nXFxzKD86W0EtWmEtel9dKjo6KSo/I3tlc2NhcGVkVGVybX06Ly8vXG4gICAgICBpZiBtYXRjaCBpc250IG51bGxcbiAgICAgICAgbGluZXMgPSBjYW5kaWRhdGUuc3BsaXQgJ1xcbidcbiAgICAgICAgY29udGludWUgaWYgbGluZXMubGVuZ3RoIDwgMlxuICAgICAgICBkZWNsVGVybXMgPSBsaW5lc1sxXS5zcGxpdCAnICdcbiAgICAgICAgW18sXyxkZWNsUmFuZ2VTdHIsXyxwb3NTdHIsLi4uXSA9IGRlY2xUZXJtc1xuICAgICAgICB3aGlsZSBub3QgZGVjbFJhbmdlU3RyLm1hdGNoIC88KC4qKTooWzAtOV0rKTooWzAtOV0rKSwvXG4gICAgICAgICAgYnJlYWsgaWYgZGVjbFRlcm1zLmxlbmd0aCA8IDVcbiAgICAgICAgICBkZWNsVGVybXMgPSBkZWNsVGVybXNbMi4uXVxuICAgICAgICAgIFtfLF8sZGVjbFJhbmdlU3RyLF8scG9zU3RyLC4uLl0gPSBkZWNsVGVybXNcbiAgICAgICAgaWYgZGVjbFJhbmdlU3RyLm1hdGNoIC88KC4qKTooWzAtOV0rKTooWzAtOV0rKSwvXG4gICAgICAgICAgW18sZmlsZSxsaW5lLGNvbF0gPSBkZWNsUmFuZ2VTdHIubWF0Y2ggLzwoLiopOihbMC05XSspOihbMC05XSspLC9cbiAgICAgICAgICBwb3NpdGlvbnMgPSBwb3NTdHIubWF0Y2ggLyhsaW5lfGNvbCk6KFswLTldKykoPzo6KFswLTldKykpPy9cbiAgICAgICAgICBpZiBwb3NpdGlvbnNcbiAgICAgICAgICAgIGlmIHBvc2l0aW9uc1sxXSBpcyAnbGluZSdcbiAgICAgICAgICAgICAgW2xpbmUsY29sXSA9IFtwb3NpdGlvbnNbMl0sIHBvc2l0aW9uc1szXV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgY29sID0gcG9zaXRpb25zWzJdXG4gICAgICAgICAgICBwbGFjZXMucHVzaCBbZmlsZSwoTnVtYmVyIGxpbmUpLChOdW1iZXIgY29sKV1cbiAgICByZXR1cm4gcGxhY2VzXG4iXX0=
