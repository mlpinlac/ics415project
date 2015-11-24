Router.route('/', {
  template: 'homecontent'
});

Router.route('/register');
Router.route('/login');
Router.route('/schedule');
Router.route('/calculator');


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
}
