package com.swp.evmsystem.model;

import com.swp.evmsystem.enums.Role;
import com.swp.evmsystem.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "nguoi_dung")
public abstract class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    Integer id;
    @Column(name = "email", length = 100, unique = true, nullable = true)
    String email;
    @Column(name = "phone", length = 10, unique = true, nullable = false)
    String phone;
    @Column(name = "password", length = 100, nullable = false)
    String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    Role role;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    UserStatus status;
}