Router.route('/', {
  template: 'homecontent'
});

Router.route('/afterlogin', {
  template: 'afterlogin'
});

Router.route('/register');
Router.route('/login');
Router.route('/schedule');
Router.route('/calculator');


Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  data: function(){
    var currentList = this.params._id;
    var currentUser = Meteor.userId();
    return Lists.findOne({ _id: currentList, createdBy: currentUser });
  },
  onBeforeAction: function() {
    var currentUser = Meteor.userId();
    if (currentUser) {
      // logged-in, if so we use this.next function
      this.next();
    }
    else {
      // not logged-in, use this.render to render a 'login' template
      this.render("login");
    }
  }
});

Todos = new Mongo.Collection('todos');
Lists = new Meteor.Collection('lists');

if (Meteor.isClient) {
  Template.register.events({
    'submit form': function(event){
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
        email: email,
        password: password
      });
      Router.go('/');
    }
  });

  Template.nav.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('login');
    }
  });

  Template.nav2.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('login');
    }
  });

  Template.nav3.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('login');
    }
  });
  Template.login.events({
    'submit form': function(event){
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error){
        if(error){
          // function() is to handle errors with login
          console.log(error.reason);
        } else{
          Router.go('afterlogin');
        }
      });
    }
  });

  Template.todos.helpers({
    'todo': function(){
      var currentList = this._id;
      var currentUser = Meteor.userId();
      return Todos.find({ listId: currentList, createdBy: currentUser }, {sort: {createdAt: -1}});
    }
  });

  Template.addTodo.events({
    'submit form': function(event){
      event.preventDefault();
      var todoName = $('[name="todoName"]').val();
      var currentUser = Meteor.userId();
      var currentList = this._id;
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        createdBy: currentUser,
        listId: currentList
      });
      $('[name="todoName"]').val('');
    }
  });

  Template.todoItem.events({
    'click .delete-todo': function(event){
      event.preventDefault();
      var documentId = this._id;
      var confirm = window.confirm("Remove this task?");
      if(confirm){
        Todos.remove({ _id: documentId });
      }
    }
  });

  Template.addList.events({
    'submit form': function(event){
      event.preventDefault();
      var listName = $('[name=listName]').val();
      var currentUser = Meteor.userId();
      Lists.insert({
        name: listName,
        createdBy: currentUser
      },
          function(error, results){
            Router.go('listPage', { _id: results });
      });
      $('[name=listName]').val('');
    }
  });

  Template.lists.helpers({
    'list': function(){
      var currentUser = Meteor.userId();
      return Lists.find({ createdBy: currentUser }, {sort: {name: 1}});
    }
  });
}

if (Meteor.isServer) {

}
