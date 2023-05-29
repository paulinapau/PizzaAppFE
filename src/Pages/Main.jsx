import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToppings } from "../Utils/toppings-axios-utils";
import { getSizes } from "../Utils/size-axios-utils";
import { getPizzaCost } from "../Utils/pizza-axios-utils";
import { createPizza } from "../Utils/pizza-axios-utils";
import { Container } from "@mui/system";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Badge,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import background from "../Pictures/background.jpg";
function Main() {
  const [toppings, setToppings] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalSum, setTotalCost] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setConfirmationAlert] = useState(false);
  const [SelectedToppingsCount, setToppingCounts] = useState([]);
  const [countSum, setCountSum] = useState(0);

  const navigator = useNavigate();
  const navigateToOrderdedPizzas = () => {
    navigator("/OrderedPizzas");
  };

  useEffect(() => {
    getToppings().then((data) => {
      setToppings(data);
    });
    getSizes().then((data) => {
      setSizes(data);
    });
  }, []);

  useEffect(() => {
    // Calculate total cost whenever selected toppings change
    calculateTotalCost(selectedSize, SelectedToppingsCount);
    const filteredCounts = SelectedToppingsCount.filter(
      (count) => typeof count === "number"
    );
    setCountSum(filteredCounts.reduce((total, count) => total + count, 0));

    if (countSum > 0) {
      setShowAlert(false);
    }
  }, [selectedSize, SelectedToppingsCount, selectedToppings, countSum]);

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prevSelectedToppings) => {
      if (prevSelectedToppings.includes(toppingId)) {
        return prevSelectedToppings.filter((id) => id !== toppingId);
      } else {
        return [...prevSelectedToppings, toppingId];
      }
    });

    setToppingCounts((prevToppingCounts) => {
      const updatedCounts = [...prevToppingCounts];
      const index = selectedToppings.indexOf(toppingId);
      if (index !== -1) {
        console.log("index", index);
        updatedCounts[toppingId] = 1;
      } else {
        delete updatedCounts[toppingId];
      }
      return updatedCounts;
    });
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };
  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    if (countSum === 0) {
      setShowAlert(true);
      return;
    }
    const filteredCounts = SelectedToppingsCount.filter(
      (count) => typeof count === "number"
    );
    const isCountMissing = selectedToppings.length !== filteredCounts.length;

    if (isCountMissing) {
      setShowAlert(true);
      return;
    }
    const Pizza = {
      selectedSize,
      selectedToppings,
      totalSum,
      SelectedToppingsCount: filteredCounts,
    };
    try {
      const response = await createPizza(Pizza);
      if (response === true) {
        setConfirmationAlert(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Handle error response
      }
    } catch (err) {
      console.log(err);
    }
  };
  const calculateTotalCost = (selectedSize, toppingCounts) => {
    if (selectedSize !== null && toppingCounts !== null) {
      const filteredCounts = toppingCounts.filter(
        (count) => typeof count === "number"
      );
      const CountsSum = filteredCounts.reduce(
        (total, count) => total + count,
        0
      );
      getPizzaCost(selectedSize, CountsSum).then((data) => {
        setTotalCost(data.result);
      });
    } else {
      setTotalCost(0);
    }
  };
  const handleIncrement = (toppingId) => {
    setToppingCounts((prevToppingCounts) => {
      const updatedCounts = [...prevToppingCounts];
      if (updatedCounts[toppingId]) {
        updatedCounts[toppingId] += 1;
      } else {
        updatedCounts[toppingId] = 1;
      }
      return updatedCounts;
    });
  };

  const handleDecrement = (toppingId) => {
    setToppingCounts((prevToppingCounts) => {
      const updatedCounts = [...prevToppingCounts];
      if (updatedCounts[toppingId] && updatedCounts[toppingId] > 0) {
        updatedCounts[toppingId] -= 1;
      }
      return updatedCounts;
    });
  };

  return (
    <>
      {showAlert && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            width: "30%",
            backgroundColor: "#FF8C00",
          }}
        >
          <AlertTitle>Warning</AlertTitle>
          Need to choose at least one pizza topping
        </Alert>
      )}
      {showConfirmation && (
        <Alert
          severity="success"
          variant="outlined"
          sx={{
            width: "30%",
            backgroundColor: "#8fce00",
          }}
        >
          <AlertTitle>Success</AlertTitle>
          Order have been submitted
        </Alert>
      )}
      <img
        src={background}
        alt="Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <Container sx={{ p: "10px" }}>
        <div>
          <Typography variant="h2" style={{ textAlign: "center" }}>
            {" "}
            Pizza shop{" "}
          </Typography>
          <Button
            variant="outlined"
            sx={{
              width: "30%",
              backgroundColor: "#C94926",
              color: "white",
              fontWeight: "bold",
              border: "1px solid #C94926",
              "&:hover": {
                color: "black",
                backgroundColor: "#C94926",
                border: "1px solid #C94926",
              },
            }}
            size="small"
            type="submit"
            onClick={navigateToOrderdedPizzas}
          >
            Ordered pizzas
          </Button>
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              borderRadius: "16px",
              p: "10px",
              mt: "20px",
            }}
          >
            <form onSubmit={handleOrderSubmit} className="p-fluid">
              <FormControl>
                <FormLabel>
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center", color: "#000" }}
                  >
                    Make your our pizza{" "}
                  </Typography>
                </FormLabel>
                <FormLabel id="demo-radio-buttons-group-label">Sizes</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="small"
                  name="radio-buttons-group"
                  required
                  onChange={handleSizeChange}
                >
                  {sizes.map((size) => (
                    <FormControlLabel
                      key={size.id}
                      value={size.id}
                      control={<Radio />}
                      label={size.name}
                      required
                    />
                  ))}
                </RadioGroup>
                <Grid container spacing={2}>
                  {toppings.map((topping, index) => (
                    <Grid item xs={12} sm={6} md={4} key={topping.id}>
                      <Paper style={{ padding: "10px", position: "relative" }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          key={topping.id}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <Checkbox
                            checked={selectedToppings.includes(topping.id)}
                            onChange={() => handleToppingChange(topping.id)}
                          />
                          <Typography>{topping.name}</Typography>
                          {selectedToppings.includes(topping.id) && (
                            <>
                              <Fab
                                size="small"
                                color="secondary"
                                aria-label="add"
                                onClick={() => handleIncrement(topping.id - 1)}
                                sx={{
                                  float: "left",
                                  marginRight: "28px",
                                  backgroundColor: "#C94926",
                                  "&:hover": {
                                    color: "black",
                                    backgroundColor: "#C94926",
                                    border: "1px solid #C94926",
                                  },
                                }}
                              >
                                <AddIcon />
                              </Fab>
                              <Badge
                                key={`badge-${topping.id}`}
                                badgeContent={SelectedToppingsCount[index]}
                                color="primary"
                                sx={{
                                  "& .MuiBadge-badge": {
                                    backgroundColor: "transparent",
                                    fontSize: "16px",
                                    color: "black",
                                    marginRight: "66px",
                                  },
                                }}
                              ></Badge>
                              <Fab
                                size="small"
                                color="secondary"
                                aria-label="remove"
                                onClick={() => handleDecrement(topping.id - 1)}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  right: "10px",
                                  transform: "translateY(-50%)",
                                  backgroundColor: "#C94926",
                                  "&:hover": {
                                    color: "black",
                                    backgroundColor: "#C94926",
                                    border: "1px solid #C94926",
                                  },
                                }}
                              >
                                <RemoveIcon />
                              </Fab>
                            </>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  display="flex"
                  marginTop="10px"
                  justifyContent="space-between"
                >
                  <Paper style={{ padding: "10px" }}>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h5" align="left" float="left">
                        Your total:
                      </Typography>
                      <Typography
                        variant="h5"
                        align="right"
                        style={{ fontWeight: "bold" }}
                      >
                        {totalSum} €
                      </Typography>
                    </Stack>
                  </Paper>

                  <Button
                    variant="outlined"
                    sx={{
                      width: "30%",
                      backgroundColor: "#347b15",
                      color: "white",
                      fontWeight: "bold",
                      border: "1px solid #347b15",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "#347b15",
                        border: "1px solid #347b15",
                      },
                    }}
                    size="small"
                    type="submit"
                  >
                    Submit Order
                  </Button>
                </Box>
              </FormControl>
            </form>
          </Box>
        </div>
      </Container>
    </>
  );
}

export default Main;
