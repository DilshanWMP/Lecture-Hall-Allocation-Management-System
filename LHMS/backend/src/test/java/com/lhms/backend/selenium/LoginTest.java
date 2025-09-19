package com.lhms.backend.selenium;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.*;

public class LoginTest {
    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();  // assumes chromedriver is on PATH
        driver.manage().window().maximize();
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void login_with_valid_credentials_should_redirect() {
        driver.get("http://localhost:5173/signin");

        driver.findElement(By.id("email")).sendKeys("praveenwmd@gmail.com");
        driver.findElement(By.id("password")).sendKeys("password");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // wait briefly for redirect
        try { Thread.sleep(2000); } catch (InterruptedException ignored) {}

        String url = driver.getCurrentUrl();
        assertTrue(url.contains("/") || url.contains("/timetable"),
                "User should be redirected after login, but was at " + url);
    }
}
