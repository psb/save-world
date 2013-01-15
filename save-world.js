var Game = new Meteor.Collection('game');
var Maps = new Meteor.Collection('maps');
var Players = new Meteor.Collection('players');

if (Meteor.isClient) {
  Meteor.autosubscribe(function() {
    Game.find().observe({
      changed: function(item){ 
        console.log(10)
      }
    })
  })

<<<<<<< HEAD
  // Meteor.call('win'); 
=======
  var restart = function(){
    Players.update( {active: true}, {$set: {guesses: 10}}, {multi: true} );
  };
>>>>>>> paul/development

  Meteor.startup(function () {  
    window.next()
    setInterval(window.next, 5000);
  })
  var checkAnswer = function(player, guess){
    console.log(player, guess);
    if ( Session.equals('answer', guess) ){
      Players.update( {_id: player._id}, {$inc: {score: +10}} );
      window.next();
    }
  };

<<<<<<< HEAD
  Template.currentPlayer.events({
    'blur .username': function (e) {
      Players.update( {_id:this._id}, {name: e.srcElement.innerText} );
    }
  });

  Template.currentPlayer.score = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  };
  
  Template.currentPlayer.location = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  };
  
  Template.currentPlayer.guesses = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  };

=======
>>>>>>> paul/development
  Template.currentPlayer.currentPlayer = function(){
    var player =  Session.get('currentPlayer');
    return Players.findOne(user);
  }

  Template.players.players = function(){
    return Players.find( {active: true}, {sort: {score: -1}} );
  };

  Template.guess.currentPlayer = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  }

  Template.guess.events = {
    'keypress #guess': function(evt, template){
      if (evt.which !== 13) return;
      var answer = evt.srcElement.value;
      Players.update( this, {$inc: {guesses: -1}} );
      checkAnswer(this, answer);
      template.find('#guess').value = '';
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

  var uck = Meteor.setInterval(start_round, 5000);
  console.log(typeof uck)

  Meteor.methods({
    win: function () {
      console.log('you win !!!' +  id)
      Meteor.clearInterval(id);
      start_round();
      id = Meteor.setInterval(start_round, 5000);
    }
  });
  Meteor.startup(function () {

    if (Game.find().count() === 0) Game.insert ({num: 0});

    if (Players.find().count() === 0){
<<<<<<< HEAD
      Players.insert({ username: 'Lord Pippen', score: 0, location: 'United-Kingdom'});
      Players.insert({ username: 'Davis the 3rd', score: 0, location: 'United-States'});
      Players.insert({ username: 'Alf', score: 0, location: 'Cocos-Keeling-Islands'});
=======
      Players.insert({ username: 'Lord Pippen', score: 0, location: 'United-Kingdom', guesses: 10, active: true });
      Players.insert({ username: 'Davis the 3rd', score: 0, location: 'United-States', guesses: 10, active: true });
      Players.insert({ username: 'Alf', score: 0, location: 'Cocos-Keeling-Islands', guesses: 10, active: true });
>>>>>>> paul/development
    }
  });
}
