var Maps = new Meteor.Collection('maps');
var Players = new Meteor.Collection('players');

if (Meteor.isClient) {
  Session.set('answer', 'NY');

  var checkAnswer = function(player, guess){
    if ( Session.equals('answer', guess) ){
      Players.update( {_id: player._id}, {$inc: {score: +10}} );
      // TODO: End game
    }
  };

  Template.players.players = function(){
    return Players.find( {} );
  };

  Template.guess.events = {
    'keypress #guess': function(evt, template){
      if (evt.which === 13) {
        var answer = template.find('#guess').value;
        Players.update( this, {$inc: {guesses: -1}} );
        checkAnswer(this, answer);
        template.find('#guess').value = '';
      }
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0){
      Players.insert({ name: 'Lord Pippen', score: 0, location: 'UK', guesses: 10 });
      Players.insert({ name: 'Davis Love Junior the 3rd', score: 0, location: 'USA', guesses: 10 });
      Players.insert({ name: 'Mo', score: 0, location: 'Mauritania', guesses: 10 });
    }
  });
}
