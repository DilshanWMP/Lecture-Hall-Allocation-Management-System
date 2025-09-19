Feature: Booking creation
  As an admin user
  I want to create a booking
  So that I can reserve a lecture hall for a module

  Scenario: Create booking for an available slot
    Given an admin user exists with email "praveenwmd@gmail.com"
    And I am authenticated as "praveenwmd@gmail.com"
    When I create a booking with moduleId 10, hallId 12, date "2025-09-25" and timeSlot "8:00 - 8:55"
    Then the booking is created successfully
