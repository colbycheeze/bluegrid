if (Meteor.isClient) {
  Template.body.helpers({
    syntaxExample: function() {
      return `<div class="container">
  <div class="row">
    <div class="col"> Full Width column </div>
    <div class="col x6">6 columns on all screen sizes</div>
    <div class="col s6">6 columns on small and up</div>
    <div class="col m6">6 columns on medium and up</div>
    <div class="col l6">6 columns on large and up</div>
  </div>
</div>`
      ;
    }
  });
}
