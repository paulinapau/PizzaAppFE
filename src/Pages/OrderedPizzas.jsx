import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderedPizzas } from "../Utils/pizza-axios-utils";
import { Container, Grid, Box, Typography, Paper, Button } from "@mui/material";
import Iliustration from "../Pictures/pizza.jpg";

function OrderedPizzas() {
  const [pizzas, setOrderedPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();
  const navigateToMain = () => {
    navigator("/");
  };

  useEffect(() => {
    getOrderedPizzas().then((data) => {
      setOrderedPizzas(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Container sx={{ p: "10px" }}>
      <Typography variant="h2" style={{ textAlign: "center" }}>
        Pizza shop
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
        onClick={navigateToMain}
      >
        Go back
      </Button>
      <h2>Ordered Pizzas</h2>
      {pizzas.length === 0 ? (
        <p>No pizzas ordered yet.</p>
      ) : (
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {pizzas.map((pizza) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pizza.id}>
              <Paper
                style={{
                  minHeight: "200px",
                  maxHeight: "600px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box position="relative">
                  <img
                    alt="pizza"
                    id="product-image"
                    src={Iliustration}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Typography variant="h5" style={{ textAlign: "center" }}>
                    Order nr. {pizza.id}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ textAlign: "left", margin: "10px" }}
                  >
                    Size: {pizza.size.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ textAlign: "left", margin: "10px" }}
                  >
                    Toppings:
                  </Typography>

                  <ul>
                    {pizza.toppingsNames
                      .split(";")
                      .map((topping, toppingIndex) => (
                        <li key={toppingIndex}>{topping}</li>
                      ))}
                  </ul>
                  <Typography variant="body1" style={{ textAlign: "center" }}>
                    Total Cost: {pizza.totalSum} €
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default OrderedPizzas;
