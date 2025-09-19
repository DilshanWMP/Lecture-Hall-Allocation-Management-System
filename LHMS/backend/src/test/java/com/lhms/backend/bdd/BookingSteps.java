package com.lhms.backend.bdd;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import io.cucumber.java.en.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;



public class BookingSteps {

    @Autowired
    private MockMvc mockMvc;

    private String jwtToken;

    @Given("an admin user exists with email {string}")
    public void an_admin_user_exists_with_email(String email) {
        // Option 1: Pre-load admin in test DB using data.sql
        // Option 2: Create here with UserRepository
        // For now, assume user already exists
    }

    @Given("I am authenticated as {string}")
    public void i_am_authenticated_as(String email) throws Exception {
        String loginJson = "{\"email\":\"" + email + "\", \"password\":\"password\"}";
        MvcResult res = mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String body = res.getResponse().getContentAsString();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(body);
        jwtToken = node.get("token").asText();
    }

    @When("I create a booking with moduleId {int}, hallId {int}, date {string} and timeSlot {string}")
    public void i_create_a_booking(int moduleId, int hallId, String date, String timeSlot) throws Exception {
        String payload = String.format(
                "{\"moduleId\":%d,\"hallId\":%d,\"bookingDate\":\"%s\",\"timeSlot\":\"%s\"}",
                moduleId, hallId, date, timeSlot
        );

        mockMvc.perform(MockMvcRequestBuilders.post("/api/bookings")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timeSlot").value(timeSlot));
    }

    @Then("the booking is created successfully")
    public void the_booking_is_created_successfully() {
        // Already validated in the previous step
    }
}
