var Maps = new Meteor.Collection('maps');
var Players = new Meteor.Collection('players');

if (Meteor.isClient) {
  Session.set('answer', 'NY');

  var restart = function(){
    Players.update( {}, {$set: {guesses: 10}}, {multi: true} );
    Session.get('currentPlayer').guesses = 10;
  };

  var checkAnswer = function(player, guess){
    console.log(player, guess);
    if ( Session.equals('answer', guess) ){
      Players.update( {_id: player._id}, {$inc: {score: +10}} );
      restart();
    }
  };

  Template.currentPlayer.username = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  };
  
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

  Template.currentPlayer.currentPlayer = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  }

  Template.players.players = function(){
    return Players.find( {}, {sort: {score: -1}} );
  };

  Template.guess.currentPlayer = function(){
    var user =  Session.get('currentPlayer');
    return Players.findOne(user);
  }

  Template.guess.events = {
    'keypress #guess': function(evt, template){
      if (evt.which === 13) {
        var answer = template.find('#guess').value;
        console.log(template);
        Players.update( this, {$inc: {guesses: -1}} );
        checkAnswer(this, answer);
        template.find('#guess').value = '';
      }
    }
  };

  Template.leaderboard.players = function(){
    return Players.find( {}, { sort: {score: -1, username: 1}, limit: 5 } );
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0){
      Players.insert({ username: 'Lord Pippen', score: 0, location: 'United-Kingdom', guesses: 10 });
      Players.insert({ username: 'Davis the 3rd', score: 0, location: 'United-States', guesses: 10 });
      Players.insert({ username: 'Alf', score: 0, location: 'Cocos-Keeling-Islands', guesses: 10 });
    }
  });
}
