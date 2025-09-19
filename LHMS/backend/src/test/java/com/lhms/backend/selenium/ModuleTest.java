package com.lhms.backend.selenium;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.*;

public class ModuleTest {
    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();

        // Log in first
        driver.get("http://localhost:5173/signin");
        driver.findElement(By.id("email")).sendKeys("praveenwmd@gmail.com");
        driver.findElement(By.id("password")).sendKeys("password");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) driver.quit();
    }

    @Test
    public void add_module_should_show_in_list() {
        driver.get("http://localhost:5173/modules");

        driver.findElement(By.cssSelector("input[placeholder='Enter module name']")).sendKeys("BDD Testing");
        driver.findElement(By.cssSelector("input[placeholder='Enter module code']")).sendKeys("BDD101");
        driver.findElement(By.xpath("//button[contains(text(),'Add')]")).click();

        try { Thread.sleep(1000); } catch (InterruptedException ignored) {}

        WebElement row = driver.findElement(By.xpath("//td[contains(text(),'BDD101')]"));
        assertNotNull(row, "Module should appear in list after adding");
    }
}
