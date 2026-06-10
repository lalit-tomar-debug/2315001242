const axios = require("axios");

async function getToken() {
  try {
    const res = await axios.post(
      "http://4.224.186.213/evaluation-service/auth",
      {
        email: "lalitsinghtomar91@gmail.com",
        name: "Lalit Tomar",
        rollNo: "2315001242",
        accessCode: "RPsgYt",
        clientID: "33cc70c1-cdf8-441d-ac0f-c2a3fd29b444",
        clientSecret: "eDxtEGBfzkZfMBpe",
      },
    );
    console.log(res.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

getToken();
