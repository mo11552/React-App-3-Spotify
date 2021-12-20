export const initialState = {
  user: null,
  playlists: [],
  playing: false,
  item: null,
  token: null,
  // " BQB3YwwiZfhNXzT4k39R8BdYmqLiuH7Zym4FHFcNrXmwNc1_fStiyOeJNET6WfPK6Q6_D5yhVHAbrpkNdZnkatg55cjRJ4x2sO8YRaSgwS7DiD2_bvg1f7hwjQJgxswUE1gNaEfAT_9GkHnb27tzIVKlW6RnbYrbpWJGFRsYhI4Er7Nj",
};
const reducer = (state = initialState, action) => {
  console.log(action);
  // action has two thing 1. type and action
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_TOKEN":
      return {
        ...state,
        token: action.token,
      };
    case "SET_PLAYLISTS":
      return {
        ...state,
        playlists: action.playlists,
      };
    case "SET_DISCOVER_WEEKLY":
      return {
        ...state,
        discover_weekly: action.discover_weekly,
      };
    default:
      return state;
  }
};
export default reducer;
