package com.example.ridesharelist.RideRequest.Repository;

import com.example.ridesharelist.RideRequest.Entity.RideRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RideRequestRepository extends JpaRepository<RideRequestEntity, Long> {
}