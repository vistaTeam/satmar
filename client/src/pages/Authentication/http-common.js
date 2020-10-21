import axios from "axios";

export default axios.create({
  baseURL: "https://satmar.herokuapp.com/",
  headers: {
    "Content-type": "application/json"
  }
});



