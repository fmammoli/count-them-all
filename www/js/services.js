angular.module('starter.services', [])
.factory('Entries', function (pouchDB) {
  //todo, persist on localStorage and a file
  var db = pouchDB('countThemAll.Entries');
  var entries = [];

  var allEntries = function () {
    return db.allDocs({include_docs: true, descending: true});
  }
  var addEntry = function (entry) {
    entry.startedAt = new Date();
    return db.info().then(function (result) {
      entry.id = result.doc_count;
      entry._id = result.update_seq.toString();
      debugger;
      return db.put(entry);
    }).then(function (resultPut) {
      return db.get(resultPut.id);
    });
  }
  var removeEntry = function (entry) {
    return db.remove(entry.doc._id, entry.doc._rev);
  }
  return{
    all: allEntries,
    add: addEntry,
    remove: removeEntry
  }
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
