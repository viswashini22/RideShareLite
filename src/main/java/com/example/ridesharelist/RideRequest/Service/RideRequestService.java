package com.example.ridesharelist.RideRequest.Service;

import com.example.ridesharelist.RideRequest.Entity.RideRequestEntity;
import com.example.ridesharelist.RideRequest.Repository.RideRequestRepository;
import com.example.ridesharelist.User.Entity.UserEntity;
import com.example.ridesharelist.User.Repository.UserRepository;
import com.example.ridesharelist.RideOffer.Entity.RideOfferEntity;
import com.example.ridesharelist.RideOffer.Repository.RideOfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RideRequestService {

    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;
    private final RideOfferRepository rideOfferRepository;

    public RideRequestService(
            RideRequestRepository rideRequestRepository,
            UserRepository userRepository,
            RideOfferRepository rideOfferRepository) {

        this.rideRequestRepository = rideRequestRepository;
        this.userRepository = userRepository;
        this.rideOfferRepository = rideOfferRepository;
    }

    // CREATE
    public RideRequestEntity addRequest(RideRequestEntity request) {

        UserEntity rider = userRepository.findById(request.getRider().getId())
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        RideOfferEntity ride = rideOfferRepository.findById(request.getRide().getId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        request.setRider(rider);
        request.setRide(ride);

        return rideRequestRepository.save(request);
    }

    // READ ALL
    public List<RideRequestEntity> getAllRequests() {
        return rideRequestRepository.findAll();
    }

    // READ BY ID
    public Optional<RideRequestEntity> getRequestById(Long id) {
        return rideRequestRepository.findById(id);
    }

    // UPDATE
    public RideRequestEntity updateRequest(Long id, RideRequestEntity request) {

        RideRequestEntity existingRequest = rideRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        UserEntity rider = userRepository.findById(request.getRider().getId())
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        RideOfferEntity ride = rideOfferRepository.findById(request.getRide().getId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        existingRequest.setRider(rider);
        existingRequest.setRide(ride);
        existingRequest.setStatus(request.getStatus());

        return rideRequestRepository.save(existingRequest);
    }

    // DELETE
    public void deleteRequest(Long id) {
        rideRequestRepository.deleteById(id);
    }
}