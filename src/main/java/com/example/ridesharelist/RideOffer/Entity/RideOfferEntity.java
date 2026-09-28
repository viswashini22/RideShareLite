package com.example.ridesharelist.RideOffer.Entity;

import com.example.ridesharelist.User.Entity.UserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ride_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideOfferEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private UserEntity driver;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;

    @Min(value = 1, message = "Available seats must be at least 1")
    private int availableSeats;

    @NotBlank(message = "Status is required")
    private String status;
}