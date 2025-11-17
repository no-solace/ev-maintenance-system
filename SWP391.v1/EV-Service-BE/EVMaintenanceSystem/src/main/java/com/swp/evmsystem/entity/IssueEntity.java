package com.swp.evmsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@Table(name = "van_de_ky_thuat")
@Builder
public class IssueEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issue_id")
    Integer issueId;
    
    @Column(name = "issue_name", length = 200, nullable = false)
    String issueName;
    
    @Column(name = "description", length = 500)
    String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_type_id")
    @JsonIgnore
    OfferTypeEntity offerType;
}
