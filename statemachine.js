class StateMachine {
  states: null,
  edges: null,
  initialState: null,
  currentState: null,

  constructor() {
    this.states = [];
    this.edges = [];
  },

  addState(name, enteringStateFunc, leavingStateFunc, initial) {
    var state = {name: name, 
                 enteringStateFunc: enteringStateFunc,
                 leavingStateFunc: leavingStateFunc, 
                 outgoingEdges: []};

    this.states.push(state);

    if (initial) {
      this.initialState = state;
    }
  }

  transition(nextStateName) {
    var nextState = this.stateWithName(nextStateName);
    var currentState = this.currentState;
    var edge = this.edgeForStatePair(currentState, nextState);

    if (edge) {
      var leavingStateFunc = currentState.leavingStateFunc;
      if (leavingStateFunc) {
        leavingStateFunc();
      }

    } 
    //Edge might be undefined if we're transitioning for the first time,
    //and we only want to print this when that's not the case.
    else if (currentState) {
      console.log("Edge not found; could not transition.");
    }

    //We check for '!currentState' since on the first transition 'currentState'
    //might be undefined but we want to cal its 'enteringStateFunc' anyway.
    if (!currentState || edge) {
      var enteringStateFunc = nextState.enteringStateFunc;
      if (enteringStateFunc) {
        enteringStateFunc();
      }
    }
  }

  edgeForStatePair(startState, destState) {
    return startState.outgoingEdges.find(edge => edge.dest.name === destState.name);
  }

  stateWithName(name) {
    this.states.find(state => return state.name === name);
  }

  connectStatePair(first, second) {
    var edge = {start: first, dest: second};

    first.outgoingEdges.push(edge);
  },

  reset() {
    this.currentState = this.initialState;
  }
}