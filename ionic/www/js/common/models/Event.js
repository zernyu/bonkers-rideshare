/*
 * Docs: https://github.com/brandid/parse-angular-patch
 */
angular.module('rideshare.common.models', [])
    .run(function () {
      var Event = Parse.Object.extend({
        className: 'Event',
        attrs: ['name', 'date', 'housingNeeded', 'registrationUrl']
      });

      var Events = Parse.Collection.extend({
        model: Event,
        className: "Event",

        comparator: function (model) {
          return -model.createdAt.getTime();
        },

        loadEventsWithName: function (name) {
          this.query = (new Parse.Query(Event));
          this.query.equalTo('name', name);
          // use the enhanced load() function to fetch the collection
          return this.find();
        },

        addEvent: function (eventData) {
          var event = new Event(eventData);

          // perform a save and return the promised object back into the Angular world
          return event.save().then(function (object) {
            this.add(object);
            return object;
          }.bind(this))
        },

        removeEvent: function (event) {
          if (!this.get(event)) return false;
          return event.destroy().then(function () {
            this.remove(event);
          }.bind(this));
        }
      });
    })
;