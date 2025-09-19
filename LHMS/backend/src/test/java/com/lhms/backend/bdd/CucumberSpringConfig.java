package com.lhms.backend.bdd;

import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@CucumberContextConfiguration
@SpringBootTest
@AutoConfigureMockMvc
public class CucumberSpringConfig {
}
