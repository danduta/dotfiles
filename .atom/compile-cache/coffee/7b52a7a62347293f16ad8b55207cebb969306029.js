(function() {
  var ClangProvider, CompositeDisposable, configurations, jumper, pchEmitter;

  CompositeDisposable = require('atom').CompositeDisposable;

  pchEmitter = require('./pch-emitter');

  jumper = require('./jumper');

  configurations = require('./configurations');

  ClangProvider = null;

  module.exports = {
    config: configurations,
    deactivationDisposables: null,
    activate: function(state) {
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:emit-pch': (function(_this) {
          return function() {
            return _this.emitPch(atom.workspace.getActiveTextEditor());
          };
        })(this)
      }));
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:go-declaration': (function(_this) {
          return function(e) {
            return _this.goDeclaration(atom.workspace.getActiveTextEditor(), e);
          };
        })(this)
      }));
    },
    emitPch: function(editor) {
      return pchEmitter.emitPch(editor);
    },
    goDeclaration: function(editor, e) {
      return jumper.goDeclaration(editor, e);
    },
    deactivate: function() {
      return this.deactivationDisposables.dispose();
    },
    provide: function() {
      if (ClangProvider == null) {
        ClangProvider = require('./clang-provider');
      }
      return new ClangProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGFuaWxhby8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2F1dG9jb21wbGV0ZS1jbGFuZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFDVCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQkFBUjs7RUFFakIsYUFBQSxHQUFnQjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxjQUFSO0lBRUEsdUJBQUEsRUFBeUIsSUFGekI7SUFJQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLHVCQUFELEdBQTJCLElBQUk7TUFDL0IsSUFBQyxDQUFBLHVCQUF1QixDQUFDLEdBQXpCLENBQTZCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw4QkFBbEIsRUFDM0I7UUFBQSw2QkFBQSxFQUErQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUM3QixLQUFDLENBQUEsT0FBRCxDQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFUO1VBRDZCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtPQUQyQixDQUE3QjthQUdBLElBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxHQUF6QixDQUE2QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsOEJBQWxCLEVBQzNCO1FBQUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUNuQyxLQUFDLENBQUEsYUFBRCxDQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFmLEVBQXFELENBQXJEO1VBRG1DO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQztPQUQyQixDQUE3QjtJQUxRLENBSlY7SUFhQSxPQUFBLEVBQVMsU0FBQyxNQUFEO2FBQVksVUFBVSxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7SUFBWixDQWJUO0lBZUEsYUFBQSxFQUFlLFNBQUMsTUFBRCxFQUFTLENBQVQ7YUFBZSxNQUFNLENBQUMsYUFBUCxDQUFxQixNQUFyQixFQUE2QixDQUE3QjtJQUFmLENBZmY7SUFpQkEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsdUJBQXVCLENBQUMsT0FBekIsQ0FBQTtJQURVLENBakJaO0lBb0JBLE9BQUEsRUFBUyxTQUFBOztRQUNQLGdCQUFpQixPQUFBLENBQVEsa0JBQVI7O2FBQ2pCLElBQUksYUFBSixDQUFBO0lBRk8sQ0FwQlQ7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xucGNoRW1pdHRlciA9IHJlcXVpcmUgJy4vcGNoLWVtaXR0ZXInXG5qdW1wZXIgPSByZXF1aXJlICcuL2p1bXBlcidcbmNvbmZpZ3VyYXRpb25zID0gcmVxdWlyZSAnLi9jb25maWd1cmF0aW9ucydcblxuQ2xhbmdQcm92aWRlciA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6IGNvbmZpZ3VyYXRpb25zXG5cbiAgZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXM6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsXG4gICAgICAnYXV0b2NvbXBsZXRlLWNsYW5nOmVtaXQtcGNoJzogPT5cbiAgICAgICAgQGVtaXRQY2ggYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsXG4gICAgICAnYXV0b2NvbXBsZXRlLWNsYW5nOmdvLWRlY2xhcmF0aW9uJzogKGUpPT5cbiAgICAgICAgQGdvRGVjbGFyYXRpb24gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLCBlXG5cbiAgZW1pdFBjaDogKGVkaXRvcikgLT4gcGNoRW1pdHRlci5lbWl0UGNoIGVkaXRvclxuXG4gIGdvRGVjbGFyYXRpb246IChlZGl0b3IsIGUpIC0+IGp1bXBlci5nb0RlY2xhcmF0aW9uIGVkaXRvciwgZVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gIHByb3ZpZGU6IC0+XG4gICAgQ2xhbmdQcm92aWRlciA/PSByZXF1aXJlKCcuL2NsYW5nLXByb3ZpZGVyJylcbiAgICBuZXcgQ2xhbmdQcm92aWRlcigpXG4iXX0=
