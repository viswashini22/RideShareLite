package com.example.ridesharelist.RideOffer.Repository;

import com.example.ridesharelist.RideOffer.Entity.RideOfferEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RideOfferRepository extends JpaRepository<RideOfferEntity, Long> {
}