import axios from "axios";

export default axios.create({
  baseURL: "http://satmar.herokuapp.com/",
  headers: {
    "Content-type": "application/json"
  }
});



