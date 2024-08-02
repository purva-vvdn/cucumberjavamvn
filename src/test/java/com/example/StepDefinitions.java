package com.example;


import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import static org.junit.Assert.assertTrue;

import static org.junit.Assert.assertTrue;

public class StepDefinitions {
    @Given("I have a configured Cucumber environment")
    public void i_have_a_configured_Cucumber_environment() {
        System.out.println("Cucumber environment configured");
    }

    @When("I run my tests")
    public void i_run_my_tests() {
        System.out.println("Running tests");
    }

    @Then("they should pass")
    public void they_should_pass() {
        System.out.println("Tests passed");
        assertTrue("Tests should be run", true);
        

    }
    
}
 