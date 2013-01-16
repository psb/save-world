var Game = new Meteor.Collection('game');
var Maps = new Meteor.Collection('maps');
var Players = new Meteor.Collection('players');

if (Meteor.isClient) {
  Meteor.startup(function () {
    Players.insert({ username: 'you', score: 0, location: ''});
    var you = Players.findOne({username:'you'});
    Session.set('id', you._id);
    window.next()
  })

  Meteor.autosubscribe(function() {
    Game.find().observe({
      changed: function(item){ 
        window.next();
      }
    })
  })

  var restart = function(){
    Players.update( {active: true}, {$set: {guesses: 10}}, {multi: true} );
  };

  var checkAnswer = function(guess){
    console.log(guess);
    if (guess.toLowerCase() === Session.get('answer').toLowerCase()){
      console.log("YOU WIN");
      console.log(Session.get('id'), Session.get('user'), Session.get('location'));
      Players.update(
        {_id: Session.get('id')},
        {$inc: {score: +10}},
        function(err){
          if (err) console.log(error);
          else {
            console.log('hello');
            Meteor.call('win');
          }
        }
      );
    }
  };

  Template.currentPlayer.events({
    'blur #curr-user': function (evt) {
      var user = evt.target.value;
      Players.update( {_id:this._id}, {$set: {username: evt.target.value}} );
      Session.set('user', user);
      Players.update( {_id: Session.get('id')},
        {$set: {'username': user}},
        function(err){
          if (err) console.log(err);
          else console.log("Saving username");
        }
      );
    },

    'keydown #curr-user': function(evt){
      if (evt.which !== 13) return;
      console.log("SUBMIT BRO");
      var user = evt.target.value;
      Session.set('user', evt.target.value);
      Players.update( {_id: Session.get('id')},
        {$set: {'username': user}},
        function(err){
          if (err) console.log(err);
          else console.log("Saving username");
        }
      );
    },

    'click #user-name': function(evt){
      Session.set('user', '');
    },
    
    'blur #player-country': function(evt, template){
      var location = evt.target.value;
      if (location) {
        Session.set('location', location);
        Players.update( {_id: Session.get('id')},
          {$set: {'location': location}},
          function(err){
            if (err) console.log(err);
            else console.log("Saving location");
          }
        );
      }
    },
    
    'keydown #player-country': function(evt, template){
      if (evt.which === 13) {
        var location = evt.target.value;
        Session.set('location', evt.target.value);
        Players.update( {_id: Session.get('id')},
          {$set: {'location': location}},
          function(err){
            if (err) console.log(err);
            else console.log("Saving location");
          }
        );
      }
    },

    'click #curr-player-flag': function(evt){
      Session.set('location', '');
    }
  });

  Template.currentPlayer._id = function(){
    return Session.get('id');
  };
  
  Template.currentPlayer.score = function(){
    var id = Session.get('id');
    console.log(id)
    return id ? Players.findOne({_id:id}).score : 0;
  };
  
  Template.currentPlayer.location = function(){
    return Session.get('location');
  };
  
  Template.currentPlayer.guesses = function(){
    var user = Session.get('currentPlayer');
    return Players.findOne(user);
  };

  Template.currentPlayer.user = function(){
    return Session.get('user');
  }

  Template.players.players = function(){
    return Players.find( {active: true}, {sort: {score: -1}} );
  };

  Template.guess.currentPlayer = function(){
    var user = Session.get('currentPlayer');
    return Players.findOne(user);
  }

  Template.guess._id = function(){
    return Session.get('id');
  }

  Template.guess.events = {
    'keypress #guess': function(evt, template){
      if (evt.which !== 13) return;
      var answer = evt.target.value;
      checkAnswer(answer);
      evt.target.value = '';
    }
  };

  Template.leaderboard.players = function(){
    return Players.find( {}, { sort: {score: -1, username: 1}, limit: 5 } );
  };
}

if (Meteor.isServer) {
  var start_round = function () {
    var number_of_countries = 177;
    var i = ~~(Math.random()  * number_of_countries);
    Game.update({}, {num: i})
    console.log(i)
  }
  var id = Meteor.setInterval(start_round, 5000);
  Meteor.methods({
    win: function () {
      Meteor.clearInterval(id);
      id = Meteor.setInterval(start_round, 5000);
      console.log("WOW")
      start_round();
    }
  });
  Meteor.startup(function () {
    if (Game.find().count() === 0) Game.insert ({num: 0});
    if (Players.find().count() === 0){
      Players.insert({ username: 'Lord Pippen', score: 0, location: 'United-Kingdom'});
      Players.insert({ username: 'Davis the 3rd', score: 0, location: 'United-States'});
      Players.insert({ username: 'Alf', score: 0, location: 'Cocos-Keeling-Islands'});
      Players.insert({ username: 'Lord Pippen', score: 0, location: 'United-Kingdom', guesses: 10, active: true });
      Players.insert({ username: 'Davis the 3rd', score: 0, location: 'United-States', guesses: 10, active: true });
      Players.insert({ username: 'Alf', score: 0, location: 'Cocos-Keeling-Islands', guesses: 10, active: true });
    }
  });
}
