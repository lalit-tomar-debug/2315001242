const axios = require("axios");

async function register() {
  try {
    const res = await axios.post(
      "http://4.224.186.213/evaluation-service/register",
      {
        email: "lalitsinghtomar91@gmail.com",
        name: "Lalit Tomar",
        mobileNo: "9389436393",
        githubUsername: "lalit-tomar-debug",
        rollNo: "2315001242",
        accessCode: "RPsgYt",
      },
    );
    console.log(res.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

register();
