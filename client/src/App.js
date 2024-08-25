import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    {
      value: "highest_lowercase_alphabet",
      label: "Highest lowercase alphabet",
    },
  ];

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Parse the input JSON
      const parsedData = JSON.parse(jsonInput);

      setIsValidJson(true);

      // Call the API with the parsed JSON input
      const res = await axios.post("http://127.0.0.1:8080/bfhl", parsedData);

      setResponse(res.data);
      setShowDropdown(true);
    } catch (error) {
      setIsValidJson(false);
      setShowDropdown(false);
      setResponse(null);
    }
  };

  const handleDropdownChange = (event) => {
    const { value } = event.target;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  const filteredResponse = selectedOptions.reduce((acc, option) => {
    if (response && response[option]) {
      acc[option] = response[option];
    }
    return acc;
  }, {});

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        JSON Validator & API Caller
      </Typography>
      <TextField
        label="Enter JSON"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={jsonInput}
        onChange={handleJsonChange}
        error={!isValidJson}
        helperText={!isValidJson ? "Invalid JSON format" : ""}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
      {showDropdown && (
        <FormControl sx={{ mt: 4, width: 300 }}>
          <InputLabel>Filter Response</InputLabel>
          <Select
            multiple
            value={selectedOptions}
            onChange={handleDropdownChange}
            input={<OutlinedInput label="Filter Response" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  checked={selectedOptions.indexOf(option.value) > -1}
                />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {Object.keys(filteredResponse).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Filtered Response:</Typography>
          <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}

export default App;
