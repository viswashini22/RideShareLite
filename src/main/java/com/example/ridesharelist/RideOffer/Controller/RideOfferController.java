package com.example.ridesharelist.RideOffer.Controller;

import com.example.ridesharelist.RideOffer.DTO.RideOfferResponse;
import com.example.ridesharelist.RideOffer.Entity.RideOfferEntity;
import com.example.ridesharelist.RideOffer.Service.RideOfferService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideOfferController {

    private final RideOfferService rideOfferService;

    public RideOfferController(RideOfferService rideOfferService) {
        this.rideOfferService = rideOfferService;
    }

    // CREATE
    @PostMapping
    public RideOfferResponse addRide(@RequestBody RideOfferEntity ride) {

        RideOfferEntity savedRide = rideOfferService.addRide(ride);

        return convertToResponse(savedRide);
    }

    // READ ALL
    @GetMapping
    public List<RideOfferResponse> getAllRides() {

        List<RideOfferEntity> rides = rideOfferService.getAllRides();
        List<RideOfferResponse> response = new ArrayList<>();

        for (RideOfferEntity ride : rides) {
            response.add(convertToResponse(ride));
        }

        return response;
    }

    // READ BY ID
    @GetMapping("/{id}")
    public RideOfferResponse getRideById(@PathVariable Long id) {

        RideOfferEntity ride = rideOfferService.getRideById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        return convertToResponse(ride);
    }

    // UPDATE
    @PutMapping("/{id}")
    public RideOfferResponse updateRide(
            @PathVariable Long id,
            @RequestBody RideOfferEntity ride) {

        RideOfferEntity updatedRide = rideOfferService.updateRide(id, ride);

        return convertToResponse(updatedRide);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteRide(@PathVariable Long id) {

        rideOfferService.deleteRide(id);

        return "Ride deleted successfully";
    }

    // Convert Entity to Response DTO
    private RideOfferResponse convertToResponse(RideOfferEntity ride) {

        return new RideOfferResponse(
                ride.getId(),
                ride.getDriver().getId(),
                ride.getDriver().getName(),
                ride.getDriver().getEmail(),
                ride.getDriver().getPhone(),
                ride.getDriver().getRole(),
                ride.getOrigin(),
                ride.getDestination(),
                ride.getDepartureTime(),
                ride.getAvailableSeats(),
                ride.getStatus()
        );
    }
}