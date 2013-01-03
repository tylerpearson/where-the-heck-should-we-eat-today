// show the number of current visitors
Visitors = new Meteor.Collection("visitor");





// Set up a collection to contain location information. On the server,
// it is backed by a MongoDB collection named "locations".

Locations = new Meteor.Collection("locations");

if (Meteor.isClient) {
  Template.leaderboard.locations = function () {
    return Locations.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_location = function () {
    var location = Locations.findOne(Session.get("selected_location"));
    return location && location.name;
  };

  Template.location.selected = function () {
    return Session.equals("selected_location", this._id) ? "selected" : '';
  };

  //Template.leaderboard.events({
  //'click input.inc': function () {
  //    Locations.update(Session.get("selected_location"), {$inc: {score: 1}});
  //  }
  //});

  Template.location.events({
    'click': function () {
      Session.set("selected_location", this._id);
      Locations.update(Session.get("selected_location"), {$inc: {score: 1}});
    }
  });

  Template.current.amount = function() {
    if(Visitors.find() != undefined) {
        return Visitors.find().fetch().length;
    }
    return '0';
  }


  /* to reset */
  konami = new Konami();
  konami.code = function() {

    var answer = confirm("Bro, are you sure you really want to reset the counts?");
    if (answer) {
        Locations.find().forEach(function(place) {
            Locations.update(place._id, {$set: {score: 0}});
        });
        console.log("Boom, that shit is reset.");
    }


  }
  konami.load();

}

// On server startup, create some locations if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Locations.find().count() === 0) {
      var names = ["Tyler's",
                   "Carburritos",
                   "Spotted Dog",
                   "Milltown",
                   "Southern Rail",
                   "Elmo's",
                   "Panzenella",
                   "Neal's Deli",
                   "Akai Hana",
                   "Venable",
                   "Jade Palace",
                   "Amante",
                   "Carborro Pizza Oven",
                   "Gourmet Kingdom",
                   "Ba-Da Wings",
                   "Buns",
                   "Top of the Hill",
                   "Jimmy Johns",
                   "Chipotle",
                   "Carolina Brewery"];
      for (var i = 0; i < names.length; i++)
        Locations.insert({name: names[i], score: 0});
    }
  });
}
