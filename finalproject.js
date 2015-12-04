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
Router.route('/calendar');


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
Times = new Mongo.Collection('times');
Lists = new Meteor.Collection('lists');
CalEvent = new Mongo.Collection('calevent');
Images = new Mongo.Collection('images');


if (Meteor.isClient) {


  Template.dialog.events({
    "click .closeDialog":function(event, template){
      Session.set('editing_event', null);
    },
    'click .updateTitle':function(evt,tmp){
      var title = tmp.find('#title').value;
      Meteor.call('updateTitle',Session.get('editing_event'),title);
      Session.set('editing_event', null);
    }
  });

  Template.calendar.helpers({
    editing_event: function(){
      return Session.get('editing_event');

    }
  });

  Template.dialog.helpers({
    title: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      return ce.title;
    }
  });

  Template.dialog.rendered = function(){
    if(Session.get('editDialog')){
      var calevent = CalEvent.findOne({_id:Session.get('editDialog')});
      if(calevent){
        $('#title').val(calevent.title);
      }
    }
  }

  Template.calendar.rendered = function(){

    var calendar = $('#calendar').fullCalendar({
      dayClick:function(date,allDay,jsEvent,view){
        var calendarEvent = {};
        calendarEvent.start = date;
        calendarEvent.end = date;
        calendarEvent.title = 'New Event';
        calendarEvent.owner = Meteor.userId();
        Meteor.call('saveCalEvent',calendarEvent);
      },
      eventClick:function(calEvent,jsEvent,view){
        console.log(calEvent);
        Session.set("editing_event", calEvent._id);

      },
      eventDrop:function(reqEvent){
        Meteor.call('moveEvent', reqEvent);
    },
      events:function(start,end,callback){
        var calEvents = CalEvent.find({"owner": Meteor.userId()},{reactive:false}).fetch();
        callback(calEvents);
      },
      editable:true,
      selectable:true,
      theme: false

    }).data().fullCalendar;
    Deps.autorun(function(){
      CalEvent.find().fetch();
      if(calendar){
        calendar.refetchEvents(); // adds events on click
      }
    })

  }

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

  Template.addTime.events({
    'submit form': function(event){
      event.preventDefault();
      var todoTime = $('[name="todoTime"]').val();
      var currentUser = Meteor.userId();
      var timeList = this._id;
      Todos.insert({
        name: todoTime,
        completed: false,
        createdAt: new Date(),
        createdBy: currentUser,
        listId: timeList
      });
      $('[name="todoTime"]').val('');
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

  Template.homecontent.helpers({
    images: function(){
      return Images.find();
    }
  });


}

if (Meteor.isServer) {

  Meteor.startup(function(){
    Meteor.methods({
      'saveCalEvent':function(ce){
        CalEvent.insert(ce);
        },
      'updateTitle':function(id,title){
        return CalEvent.update({_id:id},{$set:{title:title}});
      },
      'moveEvent':function(reqEvent){
        return CalEvent.update({_id:reqEvent._id}, {
          $set:{
            start:reqEvent.start,
            end: reqEvent.end
          }
        })
      }

    })


  })

}
