var stateMachine = new StateMachine();

var enteringCitySelector = function() {
  console.log("entering city selector");
};

var leavingCitySelector = function() {
  console.log("leaving city selector");
};

stateMachine.addState('city_selector', enteringCitySelector, leavingCitySelector, true);

var enteringCity = function() {
  console.log("entering city");
}

var leavingCity = function() {
  console.log("leaving city");
}

stateMachine.addState('city', enteringCity, leavingCity);

stateMachine.connectStatePair('city_selector', 'city');

stateMachine.start();

stateMachine.transition('city');
stateMachine.transition('city_selector');