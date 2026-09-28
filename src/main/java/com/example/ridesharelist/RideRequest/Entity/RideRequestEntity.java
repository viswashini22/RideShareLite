package com.example.ridesharelist.RideRequest.Entity;

import com.example.ridesharelist.User.Entity.UserEntity;
import com.example.ridesharelist.RideOffer.Entity.RideOfferEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ride_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rider_id", nullable = false)
    private UserEntity rider;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private RideOfferEntity ride;

    @NotNull(message = "Request status is required")
    private String status;
}