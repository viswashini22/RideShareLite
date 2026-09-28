package com.example.ridesharelist.RideRequest.Controller;

import com.example.ridesharelist.RideRequest.Entity.RideRequestEntity;
import com.example.ridesharelist.RideRequest.Service.RideRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class RideRequestController {

    private final RideRequestService rideRequestService;

    public RideRequestController(RideRequestService rideRequestService) {
        this.rideRequestService = rideRequestService;
    }

    // CREATE
    @PostMapping
    public RideRequestEntity addRequest(
            @RequestBody RideRequestEntity request) {

        return rideRequestService.addRequest(request);
    }

    // READ ALL
    @GetMapping
    public List<RideRequestEntity> getAllRequests() {

        return rideRequestService.getAllRequests();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Optional<RideRequestEntity> getRequestById(
            @PathVariable Long id) {

        return rideRequestService.getRequestById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public RideRequestEntity updateRequest(
            @PathVariable Long id,
            @RequestBody RideRequestEntity request) {

        return rideRequestService.updateRequest(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {

        rideRequestService.deleteRequest(id);

        return "Ride request deleted successfully";
    }
}