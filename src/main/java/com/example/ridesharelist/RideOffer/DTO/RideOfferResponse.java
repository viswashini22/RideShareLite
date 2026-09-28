package com.example.ridesharelist.RideOffer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideOfferResponse {

    private Long id;

    private Long driverId;
    private String driverName;
    private String driverEmail;
    private String driverPhone;
    private String driverRole;

    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private int availableSeats;
    private String status;
}