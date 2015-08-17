import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: true }
  },
  beforeModel: function(transition) {
    var hasQuery = transition
      .queryParams
      .hasOwnProperty('query');

    // if search is empty, redirect to route without param
    if(hasQuery && !transition.queryParams.query){
      this.transitionTo('search');
    }
  },
  model: function(transition) {
    var locations= this.store.find('location');
    var products = this.store.find('product', { level: '4digit' });
    var industries = this.store.find('industry', { level: 'division' });

    if(transition.query) {
      return Ember.RSVP.all([industries, locations, products])
        .then(function(array) {
          return _.chain(array)
            .map(function(d){ return d.content; })
            .flatten()
            .value();
        }, function() {
          return [];
        });
    }
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', 'location');
    this.controllerFor('application').set('entity_id', 3);
    window.scrollTo(0, 0);
  },
});
