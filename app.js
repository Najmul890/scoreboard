// initial state
const initialState = [
  {
    id: 1,
    value: 0,
  },
];

// actions types
const ADD_MATCH = "add-match";
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET_ALL_MATCH = "reset-all-match";

// actions
const addMatch = () => {
  return {
    type: ADD_MATCH,
  };
};

const increment = (id, value) => {
  return {
    type: INCREMENT,
    payload: {
      id,
      value,
    },
  };
};

const decrement = (id, value) => {
  return {
    type: DECREMENT,
    payload: {
      id,
      value
    },
  };
};

const resetAllMatch = () => {
  return {
    type: RESET_ALL_MATCH,
  };
};

// reducer
const matchReducer = (state = initialState, action) => {
  if (action.type === ADD_MATCH) {
    return [
      ...state,
      {
        id: state.length + 1,
        value: 0,
      },
    ];
  }
  if (action.type === INCREMENT) {
    const { id, value } = action.payload;
    return state.map((match) => {
      if (match.id == id) {
        return {
          ...match,
          value: match.value + value < 0 ? 0 : match.value + value,
        };
      } else {
        return { ...match };
      }
    });
  }
  if (action.type === DECREMENT) {
    const { id, value } = action.payload;
    return state.map((match) => {
      if (match.id == id) {
        return {
          ...match,
          value:match.value - value < 0 ? 0 : match.value - value
        };
      } else {
        return { ...match };
      }
    });
  }
  if(action.type === RESET_ALL_MATCH){
    return state.map(match=>{
      return {
        ...match,
        value:0
      }
    })
  }
  return state;
 
};

// create store
const store = Redux.createStore(matchReducer);

// select html element
const addMatchBtn = document.querySelector(".lws-addMatch");
const matchesContainer = document.querySelector("#matches-container");
const incrementEl = document.querySelector(".lws-increment");
const decrementEl = document.querySelector(".lws-decrement");
const resetIcon = document.querySelector(".lws-reset");

const render = () => {
  const state = store.getState();
  matchesContainer.innerHTML = "";
  state.map((match) => {
    const createdMatchDiv = document.createElement("div");
    createdMatchDiv.setAttribute("class", "match");
    createdMatchDiv.dataset.id = match.id;
    createdMatchDiv.innerHTML = `
    
    <div class="wrapper">
    <button class="lws-delete">
        <img src="./image/delete.svg" alt="" />
    </button>
    <h3 class="lws-matchName">Match ${match.id} </h3>
</div>
<div class="inc-dec">
    <form  class="incrementForm" >
        <h4>Increment</h4>
        <input
            type="number"
            name="increment"
            class="lws-increment"
        />
    </form>
    <form class="decrementForm">
        <h4>Decrement</h4>
        <input
            type="number"
            name="decrement"
            class="lws-decrement"
        />
    </form>
</div>
<div class="numbers">
    <h2 class="lws-singleResult">${match.value}</h2>
</div>
        `;
    matchesContainer.appendChild(createdMatchDiv);
  });
};

// update UI initially
render();

// subscribe to the store
store.subscribe(render);

// handle event listener
addMatchBtn.addEventListener("click", () => {
  store.dispatch(addMatch());
});

document.addEventListener("keypress", (event) => {
  const targetEl = event.target.closest(".lws-increment, .lws-decrement");

  if (targetEl && event.key === "Enter") {
    event.preventDefault();
    const { id } = targetEl.closest("[data-id]").dataset;
    const inputValue = Number(targetEl.value);
    const action = targetEl.classList.contains("lws-increment")
      ? increment
      : decrement;
    store.dispatch(action(id, inputValue));
  }
});

resetIcon.addEventListener('click',()=>{
  store.dispatch(resetAllMatch());
})
