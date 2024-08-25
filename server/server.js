const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const email = "kolupotisai.prakash2021@vitstudent.ac.in";
const rollNumber = "21BCE2920";
const userId = "Kolupoti_Sai_Prakash_120604";

function separateData(data) {
  const numbers = [];
  const alphabets = [];
  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else {
      alphabets.push(item);
    }
  });
  return { numbers, alphabets };
}

app.post("/bfhl", (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data)) {
    // Added check for data being an array
    return res.status(400).json({ is_success: false, error: "Invalid input" });
  }

  const { numbers, alphabets } = separateData(data);
  const lowercaseAlphabets = alphabets.filter(
    (char) => char >= "a" && char <= "z"
  );

  const highestLowercaseAlphabet = lowercaseAlphabets.length
    ? [lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]]
    : [];

  const response = {
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
  };

  res.json(response);
});

app.get("/bfhl", (req, res) => {
  const response = {
    operation_code: 1,
  };

  res.status(200).json(response);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
