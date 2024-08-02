package com;


import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.junit.Assert.assertTrue;

public class StepDefinitions {
    @Given("I have a configured Cucumber-JUnit project")
    public void i_have_a_configured_cucumber_junit_project() {
        // Setup code or assertions
    }

    @When("I run the tests")
    public void i_run_the_tests() {
        // Test execution code or assertions
    }

    @Then("they should pass")
    public void they_should_pass() {
        assertTrue(true);
    }
}
