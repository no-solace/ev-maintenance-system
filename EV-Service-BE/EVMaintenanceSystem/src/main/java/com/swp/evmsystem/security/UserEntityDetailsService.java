package com.swp.evmsystem.security;

import com.swp.evmsystem.model.UserEntity;
import com.swp.evmsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserEntityDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public UserEntityDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username.contains("@")) {
            return loadUserByEmail(username);
        } else {
            return loadUserByPhone(username);
        }
    }

    private UserDetails loadUserByEmail(String email)  {
        Optional<UserEntity> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new UserEntityDetails(user.get());
    }

    private UserDetails loadUserByPhone(String phone) {
        Optional<UserEntity> user = userRepository.findByPhone(phone);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with phone: " + phone);
        }
        return new UserEntityDetails(user.get());
    }
}