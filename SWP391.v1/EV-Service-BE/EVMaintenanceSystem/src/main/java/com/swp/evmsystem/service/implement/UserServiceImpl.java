package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.entity.UserEntity;
import com.swp.evmsystem.mapper.CustomerMapper;
import com.swp.evmsystem.mapper.UserMapper;
import com.swp.evmsystem.repository.UserRepository;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repository;
    @Autowired
    private UserMapper mapper;
    @Autowired
    private CustomerMapper customerMapper;
    @Override
    public boolean createUser(UserEntity user) {
        return repository.save(user) != null;
    }

    @Override
    public UserDTO getUserByUserDetail(UserEntityDetails userDetail) {
        return  mapper.toDTO(userDetail.userEntity());
    }

    @Override
    public int getAllCount() {
        return repository.findAll().size();
    }

    @Override
    public java.util.Optional<UserEntity> findByPhone(String phone) {
        return repository.findByPhone(phone);
    }
    
    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerMapper.toDTOList(repository.findAllCustomers());
    }
}
