(function() {
  var BufferedProcess, ClangFlags, addClangFlags, addCommonArgs, addDocumentationArgs, fs, getCommons, makeFileBasedArgs, os, path, uuidv4;

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  fs = require('fs');

  os = require('os');

  uuidv4 = require('uuid').v4;

  ClangFlags = require('clang-flags');

  module.exports = {
    spawnClang: function(cwd, args, input, callback) {
      return new Promise(function(resolve) {
        var argsCountThreshold, bufferedProcess, command, errors, exit, filePath, options, outputs, ref, ref1, stderr, stdout;
        command = atom.config.get("autocomplete-clang.clangCommand");
        options = {
          cwd: cwd
        };
        ref = [[], []], outputs = ref[0], errors = ref[1];
        stdout = function(data) {
          return outputs.push(data);
        };
        stderr = function(data) {
          return errors.push(data);
        };
        argsCountThreshold = atom.config.get("autocomplete-clang.argsCountThreshold");
        if ((args.join(" ")).length > (argsCountThreshold || 7000)) {
          ref1 = makeFileBasedArgs(args), args = ref1[0], filePath = ref1[1];
          exit = function(code) {
            fs.unlinkSync(filePath);
            return callback(code, outputs.join('\n'), errors.join('\n'), resolve);
          };
        } else {
          exit = function(code) {
            return callback(code, outputs.join('\n'), errors.join('\n'), resolve);
          };
        }
        bufferedProcess = new BufferedProcess({
          command: command,
          args: args,
          options: options,
          stdout: stdout,
          stderr: stderr,
          exit: exit
        });
        bufferedProcess.process.stdin.setEncoding = 'utf-8';
        bufferedProcess.process.stdin.write(input);
        return bufferedProcess.process.stdin.end();
      });
    },
    buildCodeCompletionArgs: function(editor, row, column, language) {
      var args, currentDir, filePath, pchPath, ref, std;
      ref = getCommons(editor, language), std = ref.std, filePath = ref.filePath, currentDir = ref.currentDir, pchPath = ref.pchPath;
      args = [];
      args.push("-fsyntax-only");
      args.push("-x" + language);
      args.push("-Xclang", "-code-completion-macros");
      args.push("-Xclang", "-code-completion-at=-:" + (row + 1) + ":" + (column + 1));
      if (fs.existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      return addCommonArgs(args, std, currentDir, pchPath, filePath);
    },
    buildAstDumpArgs: function(editor, language, term) {
      var args, currentDir, filePath, pchPath, ref, std;
      ref = getCommons(editor, language), std = ref.std, filePath = ref.filePath, currentDir = ref.currentDir, pchPath = ref.pchPath;
      args = [];
      args.push("-fsyntax-only");
      args.push("-x" + language);
      args.push("-Xclang", "-ast-dump");
      args.push("-Xclang", "-ast-dump-filter");
      args.push("-Xclang", "" + term);
      if (fs.existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      return addCommonArgs(args, std, currentDir, pchPath, filePath);
    },
    buildEmitPchArgs: function(editor, language) {
      var args, currentDir, filePath, pchPath, ref, std;
      ref = getCommons(editor, language), std = ref.std, filePath = ref.filePath, currentDir = ref.currentDir, pchPath = ref.pchPath;
      args = [];
      args.push("-x" + language + "-header");
      args.push("-Xclang", "-emit-pch", "-o", pchPath);
      return addCommonArgs(args, std, currentDir, pchPath, filePath);
    }
  };

  getCommons = function(editor, language) {
    var currentDir, filePath, pchFile, pchFilePrefix;
    pchFilePrefix = atom.config.get("autocomplete-clang.pchFilePrefix");
    pchFile = [pchFilePrefix, language, "pch"].join('.');
    filePath = editor.getPath();
    currentDir = path.dirname(filePath);
    return {
      std: atom.config.get("autocomplete-clang.std " + language),
      filePath: filePath,
      currentDir: currentDir,
      pchPath: path.join(currentDir, pchFile)
    };
  };

  addCommonArgs = function(args, std, currentDir, pchPath, filePath) {
    var i, j, len, ref;
    if (std) {
      args.push("-std=" + std);
    }
    ref = atom.config.get("autocomplete-clang.includePaths");
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      args.push("-I" + i);
    }
    args.push("-I" + currentDir);
    args = addDocumentationArgs(args);
    args = addClangFlags(args, filePath);
    args.push("-");
    return args;
  };

  addClangFlags = function(args, filePath) {
    var clangflags, error;
    try {
      clangflags = ClangFlags.getClangFlags(filePath);
      if (clangflags) {
        args = args.concat(clangflags);
      }
    } catch (error1) {
      error = error1;
      console.log("clang-flags error:", error);
    }
    return args;
  };

  addDocumentationArgs = function(args) {
    if (atom.config.get("autocomplete-clang.includeDocumentation")) {
      args.push("-Xclang", "-code-completion-brief-comments");
      if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
        args.push("-fparse-all-comments");
      }
      if (atom.config.get("autocomplete-clang.includeSystemHeadersDocumentation")) {
        args.push("-fretain-comments-from-system-headers");
      }
    }
    return args;
  };

  makeFileBasedArgs = function(args) {
    var filePath;
    args = args.join('\n');
    args = args.replace(/\\/g, "\\\\");
    args = args.replace(/\ /g, "\\\ ");
    filePath = path.join(os.tmpdir(), "acargs-" + uuidv4());
    fs.writeFileSync(filePath, args);
    args = ['@' + filePath];
    return [args, filePath];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2NsYW5nLWFyZ3MtYnVpbGRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFDcEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0MsU0FBVyxPQUFBLENBQVEsTUFBUixFQUFmOztFQUNGLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsVUFBQSxFQUFZLFNBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxLQUFaLEVBQW1CLFFBQW5CO2FBQ1YsSUFBSSxPQUFKLENBQVksU0FBQyxPQUFEO0FBQ1YsWUFBQTtRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCO1FBQ1YsT0FBQSxHQUFVO1VBQUEsR0FBQSxFQUFLLEdBQUw7O1FBQ1YsTUFBb0IsQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFwQixFQUFDLGdCQUFELEVBQVU7UUFDVixNQUFBLEdBQVMsU0FBQyxJQUFEO2lCQUFTLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYjtRQUFUO1FBQ1QsTUFBQSxHQUFTLFNBQUMsSUFBRDtpQkFBUyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7UUFBVDtRQUNULGtCQUFBLEdBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEI7UUFDckIsSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFELENBQWdCLENBQUMsTUFBakIsR0FBMEIsQ0FBQyxrQkFBQSxJQUFzQixJQUF2QixDQUE3QjtVQUNFLE9B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Q0FBYSxLQUFiLEVBQW9CLE1BQXBCO0lBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixNQUFwQjtJQUNQLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUF1QixTQUFBLEdBQVUsTUFBQSxDQUFBLENBQWpDO0lBQ1gsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsSUFBM0I7SUFDQSxJQUFBLEdBQU8sQ0FBQyxHQUFBLEdBQU0sUUFBUDtXQUNQLENBQUMsSUFBRCxFQUFPLFFBQVA7RUFQa0I7QUEvRnBCIiwic291cmNlc0NvbnRlbnQiOlsie0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xub3MgPSByZXF1aXJlICdvcydcbnsgdjQ6IHV1aWR2NCB9ID0gcmVxdWlyZSAndXVpZCc7XG5DbGFuZ0ZsYWdzID0gcmVxdWlyZSAnY2xhbmctZmxhZ3MnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBzcGF3bkNsYW5nOiAoY3dkLCBhcmdzLCBpbnB1dCwgY2FsbGJhY2spLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICAgIGNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuY2xhbmdDb21tYW5kXCJcbiAgICAgIG9wdGlvbnMgPSBjd2Q6IGN3ZFxuICAgICAgW291dHB1dHMsIGVycm9yc10gPSBbW10sIFtdXVxuICAgICAgc3Rkb3V0ID0gKGRhdGEpLT4gb3V0cHV0cy5wdXNoIGRhdGFcbiAgICAgIHN0ZGVyciA9IChkYXRhKS0+IGVycm9ycy5wdXNoIGRhdGFcbiAgICAgIGFyZ3NDb3VudFRocmVzaG9sZCA9IGF0b20uY29uZmlnLmdldChcImF1dG9jb21wbGV0ZS1jbGFuZy5hcmdzQ291bnRUaHJlc2hvbGRcIilcbiAgICAgIGlmIChhcmdzLmpvaW4oXCIgXCIpKS5sZW5ndGggPiAoYXJnc0NvdW50VGhyZXNob2xkIG9yIDcwMDApXG4gICAgICAgIFthcmdzLCBmaWxlUGF0aF0gPSBtYWtlRmlsZUJhc2VkQXJncyBhcmdzXG4gICAgICAgIGV4aXQgPSAoY29kZSktPlxuICAgICAgICAgIGZzLnVubGlua1N5bmMgZmlsZVBhdGhcbiAgICAgICAgICBjYWxsYmFjayBjb2RlLCAob3V0cHV0cy5qb2luICdcXG4nKSwgKGVycm9ycy5qb2luICdcXG4nKSwgcmVzb2x2ZVxuICAgICAgZWxzZVxuICAgICAgICBleGl0ID0gKGNvZGUpLT4gY2FsbGJhY2sgY29kZSwgKG91dHB1dHMuam9pbiAnXFxuJyksIChlcnJvcnMuam9pbiAnXFxuJyksIHJlc29sdmVcbiAgICAgIGJ1ZmZlcmVkUHJvY2VzcyA9IG5ldyBCdWZmZXJlZFByb2Nlc3Moe2NvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIHN0ZG91dCwgc3RkZXJyLCBleGl0fSlcbiAgICAgIGJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLnNldEVuY29kaW5nID0gJ3V0Zi04J1xuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4ud3JpdGUgaW5wdXRcbiAgICAgIGJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLmVuZCgpXG5cbiAgYnVpbGRDb2RlQ29tcGxldGlvbkFyZ3M6IChlZGl0b3IsIHJvdywgY29sdW1uLCBsYW5ndWFnZSkgLT5cbiAgICB7c3RkLCBmaWxlUGF0aCwgY3VycmVudERpciwgcGNoUGF0aH0gPSBnZXRDb21tb25zIGVkaXRvcixsYW5ndWFnZVxuICAgIGFyZ3MgPSBbXVxuICAgIGFyZ3MucHVzaCBcIi1mc3ludGF4LW9ubHlcIlxuICAgIGFyZ3MucHVzaCBcIi14I3tsYW5ndWFnZX1cIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItY29kZS1jb21wbGV0aW9uLW1hY3Jvc1wiXG4gICAgYXJncy5wdXNoIFwiLVhjbGFuZ1wiLCBcIi1jb2RlLWNvbXBsZXRpb24tYXQ9LToje3JvdyArIDF9OiN7Y29sdW1uICsgMX1cIlxuICAgIGFyZ3MucHVzaChcIi1pbmNsdWRlLXBjaFwiLCBwY2hQYXRoKSBpZiBmcy5leGlzdHNTeW5jKHBjaFBhdGgpXG4gICAgYWRkQ29tbW9uQXJncyBhcmdzLCBzdGQsIGN1cnJlbnREaXIsIHBjaFBhdGgsIGZpbGVQYXRoXG5cbiAgYnVpbGRBc3REdW1wQXJnczogKGVkaXRvciwgbGFuZ3VhZ2UsIHRlcm0pLT5cbiAgICB7c3RkLCBmaWxlUGF0aCwgY3VycmVudERpciwgcGNoUGF0aH0gPSBnZXRDb21tb25zIGVkaXRvcixsYW5ndWFnZVxuICAgIGFyZ3MgPSBbXVxuICAgIGFyZ3MucHVzaCBcIi1mc3ludGF4LW9ubHlcIlxuICAgIGFyZ3MucHVzaCBcIi14I3tsYW5ndWFnZX1cIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItYXN0LWR1bXBcIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItYXN0LWR1bXAtZmlsdGVyXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiI3t0ZXJtfVwiXG4gICAgYXJncy5wdXNoKFwiLWluY2x1ZGUtcGNoXCIsIHBjaFBhdGgpIGlmIGZzLmV4aXN0c1N5bmMocGNoUGF0aClcbiAgICBhZGRDb21tb25BcmdzIGFyZ3MsIHN0ZCwgY3VycmVudERpciwgcGNoUGF0aCwgZmlsZVBhdGhcblxuICBidWlsZEVtaXRQY2hBcmdzOiAoZWRpdG9yLCBsYW5ndWFnZSktPlxuICAgIHtzdGQsIGZpbGVQYXRoLCBjdXJyZW50RGlyLCBwY2hQYXRofSA9IGdldENvbW1vbnMgZWRpdG9yLGxhbmd1YWdlXG4gICAgYXJncyA9IFtdXG4gICAgYXJncy5wdXNoIFwiLXgje2xhbmd1YWdlfS1oZWFkZXJcIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItZW1pdC1wY2hcIiwgXCItb1wiLCBwY2hQYXRoXG4gICAgYWRkQ29tbW9uQXJncyBhcmdzLCBzdGQsIGN1cnJlbnREaXIsIHBjaFBhdGgsIGZpbGVQYXRoXG5cbmdldENvbW1vbnMgPSAoZWRpdG9yLCBsYW5ndWFnZSktPlxuICBwY2hGaWxlUHJlZml4ID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnBjaEZpbGVQcmVmaXhcIlxuICBwY2hGaWxlID0gW3BjaEZpbGVQcmVmaXgsIGxhbmd1YWdlLCBcInBjaFwiXS5qb2luICcuJ1xuICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgY3VycmVudERpciA9IHBhdGguZGlybmFtZSBmaWxlUGF0aFxuICB7XG4gICAgc3RkOiAoYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnN0ZCAje2xhbmd1YWdlfVwiKSxcbiAgICBmaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgY3VycmVudERpcjogY3VycmVudERpcixcbiAgICBwY2hQYXRoOiAocGF0aC5qb2luIGN1cnJlbnREaXIsIHBjaEZpbGUpXG4gIH1cblxuYWRkQ29tbW9uQXJncyA9IChhcmdzLCBzdGQsIGN1cnJlbnREaXIsIHBjaFBhdGgsIGZpbGVQYXRoKS0+XG4gIGFyZ3MucHVzaCBcIi1zdGQ9I3tzdGR9XCIgaWYgc3RkXG4gIGFyZ3MucHVzaCBcIi1JI3tpfVwiIGZvciBpIGluIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlUGF0aHNcIlxuICBhcmdzLnB1c2ggXCItSSN7Y3VycmVudERpcn1cIlxuICBhcmdzID0gYWRkRG9jdW1lbnRhdGlvbkFyZ3MgYXJnc1xuICBhcmdzID0gYWRkQ2xhbmdGbGFncyBhcmdzLCBmaWxlUGF0aFxuICBhcmdzLnB1c2ggXCItXCJcbiAgYXJnc1xuXG5hZGRDbGFuZ0ZsYWdzID0gKGFyZ3MsIGZpbGVQYXRoKS0+XG4gIHRyeVxuICAgIGNsYW5nZmxhZ3MgPSBDbGFuZ0ZsYWdzLmdldENsYW5nRmxhZ3MoZmlsZVBhdGgpXG4gICAgYXJncyA9IGFyZ3MuY29uY2F0IGNsYW5nZmxhZ3MgaWYgY2xhbmdmbGFnc1xuICBjYXRjaCBlcnJvclxuICAgIGNvbnNvbGUubG9nIFwiY2xhbmctZmxhZ3MgZXJyb3I6XCIsIGVycm9yXG4gIGFyZ3NcblxuYWRkRG9jdW1lbnRhdGlvbkFyZ3MgPSAoYXJncyktPlxuICBpZiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZURvY3VtZW50YXRpb25cIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItY29kZS1jb21wbGV0aW9uLWJyaWVmLWNvbW1lbnRzXCJcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZU5vbkRveHlnZW5Db21tZW50c0FzRG9jdW1lbnRhdGlvblwiXG4gICAgICBhcmdzLnB1c2ggXCItZnBhcnNlLWFsbC1jb21tZW50c1wiXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVTeXN0ZW1IZWFkZXJzRG9jdW1lbnRhdGlvblwiXG4gICAgICBhcmdzLnB1c2ggXCItZnJldGFpbi1jb21tZW50cy1mcm9tLXN5c3RlbS1oZWFkZXJzXCJcbiAgYXJnc1xuXG5tYWtlRmlsZUJhc2VkQXJncyA9IChhcmdzKS0+XG4gIGFyZ3MgPSBhcmdzLmpvaW4oJ1xcbicpXG4gIGFyZ3MgPSBhcmdzLnJlcGxhY2UgL1xcXFwvZywgXCJcXFxcXFxcXFwiXG4gIGFyZ3MgPSBhcmdzLnJlcGxhY2UgL1xcIC9nLCBcIlxcXFxcXCBcIlxuICBmaWxlUGF0aCA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgXCJhY2FyZ3MtXCIrdXVpZHY0KCkpXG4gIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsIGFyZ3NcbiAgYXJncyA9IFsnQCcgKyBmaWxlUGF0aF1cbiAgW2FyZ3MsIGZpbGVQYXRoXVxuIl19
