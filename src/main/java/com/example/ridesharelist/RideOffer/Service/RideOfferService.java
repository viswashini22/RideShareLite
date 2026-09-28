package com.example.ridesharelist.RideOffer.Service;

import com.example.ridesharelist.RideOffer.Entity.RideOfferEntity;
import com.example.ridesharelist.RideOffer.Repository.RideOfferRepository;
import com.example.ridesharelist.User.Entity.UserEntity;
import com.example.ridesharelist.User.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RideOfferService {

    private final RideOfferRepository rideOfferRepository;
    private final UserRepository userRepository;

    public RideOfferService(
            RideOfferRepository rideOfferRepository,
            UserRepository userRepository) {

        this.rideOfferRepository = rideOfferRepository;
        this.userRepository = userRepository;
    }

    // CREATE
    public RideOfferEntity addRide(RideOfferEntity ride) {

        UserEntity driver = userRepository.findById(ride.getDriver().getId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        ride.setDriver(driver);

        return rideOfferRepository.save(ride);
    }

    // READ ALL
    public List<RideOfferEntity> getAllRides() {
        return rideOfferRepository.findAll();
    }

    // READ BY ID
    public Optional<RideOfferEntity> getRideById(Long id) {
        return rideOfferRepository.findById(id);
    }

    // UPDATE
    public RideOfferEntity updateRide(Long id, RideOfferEntity ride) {

        RideOfferEntity existingRide = rideOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        UserEntity driver = userRepository.findById(ride.getDriver().getId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        existingRide.setDriver(driver);
        existingRide.setOrigin(ride.getOrigin());
        existingRide.setDestination(ride.getDestination());
        existingRide.setDepartureTime(ride.getDepartureTime());
        existingRide.setAvailableSeats(ride.getAvailableSeats());
        existingRide.setStatus(ride.getStatus());

        return rideOfferRepository.save(existingRide);
    }

    // DELETE
    public void deleteRide(Long id) {
        rideOfferRepository.deleteById(id);
    }
}