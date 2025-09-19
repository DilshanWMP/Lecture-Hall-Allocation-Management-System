package com.lhms.backend.bdd;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/resources/features",
        glue = "com.lhms.backend.bdd",
        plugin = { "pretty", "summary", "html:target/cucumber-reports.html" }
)
public class CucumberTest {
}
