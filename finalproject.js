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
    var currentUser = Meteor.user().username;
    return Lists.findOne({ _id: currentList, createdBy: currentUser });
  },
  onBeforeAction: function() {
    var currentUser = Meteor.user().username;
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

  $.validator.setDefaults({
    rules: {
      username: {
        required: true
      },
      email: {
        required: true
      },
      password: {
        required: true
      }
    },

    messages: {
      username: {
        required: "Required field",
      },
      email: {
        required: "Required field",
        email: "Invalid email"
      },
      password: {
        required: "Required field"
      }
    }
  });

  Template.register.events({
    'submit form': function(event){
      event.preventDefault();
      /*
      var username = $('[name=username]').val();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
        username: username,
        email: email,
        password: password
      });
      Router.go('afterlogin');
      */

    }
  });

  Template.register.onRendered(function(){
    // template rendered and inserted into DOM
    var validator = $('.register').validate({
      submitHandler: function(event){
        var username = $('[name=username]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
          username: username,
          email: email,
          password: password
        }, function(error){
          if (error) {
            validator.showErrors({
              email: "Email is already a registered user"
            });
          }
          else {
            Router.go('afterlogin');
          }
        });
      }
    });
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

      /*
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
      */
    }
  });

  Template.login.onCreated(function(){
    console.log("The 'login' template was just created.");
  });

  Template.login.onRendered(function(){
    // login template rendered and inserted into DOM
    var validator = $('.login').validate({
      submitHandler: function(event){
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
            if (error.reason == "User not found"){
              validator.showErrors({
                email: "Hm, no records of this account."
              });
            }

            if (error.reason == "Incorrect password"){
              validator.showErrors({
                password: "Incorrect password."
              });
            }
          } else{
            Router.go('afterlogin');
          }
        });
      }
    });
  });

  Template.login.onDestroyed(function(){
    console.log("The 'login' template was just destroyed.");
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
