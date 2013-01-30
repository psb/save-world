var Chitchat = new Meteor.Collection('chitchat');
var Game = new Meteor.Collection('game');
var Players = new Meteor.Collection('players');

if (Meteor.isClient) {

  Meteor.setInterval(function () {
    Players.update({_id: Session.get('id')}, {$set: {last_seen: Date.now()}});
  },1000 * 60);

  Meteor.startup(function () {
    d3.select('body').append('svg');
    Session.set('answer','');
    Players.insert({ username: 'you', score: 0, location: ''});
    var you = Players.findOne({username:'you'});
    Session.set('id', you._id);
    window.next();
  });

  Meteor.autosubscribe(function() {
    Game.find().observe({
      changed: function(item){
        window.next(Game.findOne().num);
      }
    });
  });

  Template.chat.events({
    'keydown .message': function(e) {
      if (e.which != 13) {
        return
      };
      var obj = {
        username: Session.get('user'),
        message: $('.message').val()
      }
      Chitchat.insert(obj);
      e.srcElement.value = ("");
    }
  });

  Template.chat.convo = function () {
    return Chitchat.find({});
  };
  var restart = function(){
    Players.update( {active: true}, {$set: {guesses: 10}}, {multi: true} );
  };

  var checkAnswer = function(guess){
    if (guess.toLowerCase() === Session.get('answer').toLowerCase()){
      Players.update(
        {_id: Session.get('id')},
        {$inc: {score: +10}},
        function(err){
          if (err) console.log(error);
          else {
            $('.meteor-image').stop().offset({ top: -790, left: 0 });
            $('.score-number').css('color', '#29B329');
            $('.score-number').animate({ fontSize: '60px' }, 300, function(){
              $('.score-number').animate({ fontSize: '30px' }, 300, function(){
                $('.score-number').css('color', '#000000');
                Meteor.call('win');
              });
            });
          }
        }
      );
    } else {
      $('.incorrect-feedback').text('Incorrect. Try Again.');
      setTimeout(function() {
        $('.incorrect-feedback').text('');
      }, 600);
    }
  };

  Template.choices.clickme = function () {
    var x = Session.get('answer');
    var y = '12345'.split('')
          .map(function () { return ~~ (Math.random() * 250) })
          .map(function (i) { return data_names[i].name.slice(0,15) });

    if (x) y.push(x);
    return y.sort();
  };

  Template.choices.events({
    'click li' : function (e) {
      checkAnswer(e.target.innerText.slice(2));
    }
  });
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
  };

  Template.players.players = function(){
    return Players.find({last_seen: {$gt: Date.now() - 1000 * 30}});
  };

  Template.guess.currentPlayer = function(){
    var user = Session.get('currentPlayer');
    return Players.findOne(user);
  };

  Template.guess._id = function(){
    return Session.get('id');
  };

  Template.guess.events = {
    'keypress #guess': function(evt, template){
      if (evt.which !== 13) return;
      var answer = evt.target.value;
      checkAnswer(answer);
      evt.target.value = '';
    }
  };

  Template.leaderboard.players = function(){
    return Players.find( {}, { sort: {score: -1, username: 1}, limit: 10 } );
  };
}

if (Meteor.isServer) {
  var start_round = function () {
    var number_of_countries = 177;
    var i = ~~(Math.random()  * number_of_countries);
    Game.update({}, {num: i});
  };
  var id = Meteor.setInterval(start_round, 5000);
  Meteor.methods({
    win: function () {
      Meteor.clearInterval(id);
      id = Meteor.setInterval(start_round, 5000);
      start_round();
    }
  });
  Meteor.startup(function () {
    if (Game.find().count() === 0) Game.insert({num: 0});
  });
}

if (Meteor.isClient)  Template.currentPlayer.datalist = function () {
  return [
  'Abkhazia',
  'Afghanistan',
  'Aland',
  'Albania',
  'Algeria',
  'American-Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua-and-Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia-and-Herzegovina',
  'Botswana',
  'Brazil',
  'British-Antarctic-Territory',
  'British-Virgin-Islands',
  'Brunei',
  'Bulgaria',
  'Burkina-Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape-Verde',
  'Cayman-Islands',
  'Central-African-Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas-Island',
  'Cocos-Keeling-Islands',
  'Colombia',
  'Commonwealth',
  'Comoros',
  'Cook-Islands',
  'Costa-Rica',
  'Cote-d-Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech-Republic',
  'Democratic-Republic-of-the-Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican-Republic',
  'East-Timor',
  'Ecuador',
  'Egypt',
  'El-Salvador',
  'England',
  'Equatorial-Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'European-Union',
  'Falkland-Islands',
  'Faroes',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'GoSquared',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea-Bissau',
  'Guinea',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong-Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle-of-Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macau',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Mars',
  'Marshall-Islands',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'NATO',
  'Nagorno-Karabakh',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands-Antilles',
  'Netherlands',
  'New-Caledonia',
  'New-Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk-Island',
  'North-Korea',
  'Northern-Cyprus',
  'Northern-Mariana-Islands',
  'Norway',
  'Olympics',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua-New-Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn-Islands',
  'Poland',
  'Portugal',
  'Puerto-Rico',
  'Qatar',
  'Red-Cross',
  'Republic-of-the-Congo',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint-Barthelemy',
  'Saint-Helena',
  'Saint-Kitts-and-Nevis',
  'Saint-Lucia',
  'Saint-Vincent-and-the-Grenadines',
  'Samoa',
  'San-Marino',
  'Sao-Tome-and-Principe',
  'Saudi-Arabia',
  'Scotland',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra-Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon-Islands',
  'Somalia',
  'Somaliland',
  'South-Africa',
  'South-Georgia-and-the-South-Sandwich-Islands',
  'South-Korea',
  'South-Ossetia',
  'South-Sudan',
  'Spain',
  'Sri-Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad-and-Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks-and-Caicos-Islands',
  'Tuvalu',
  'US-Virgin-Islands',
  'Uganda',
  'Ukraine',
  'United-Arab-Emirates',
  'United-Kingdom',
  'United-Nations',
  'United-States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican-City',
  'Venezuela',
  'Vietnam',
  'Wales',
  'Western-Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe']
};
