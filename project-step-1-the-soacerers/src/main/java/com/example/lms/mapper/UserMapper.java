package com.example.lms.mapper;

import com.example.lms.dto.RegisterRequest;
import com.example.lms.dto.UserDTO;
import com.example.lms.entity.User;

public class UserMapper {

    public static User toEntity(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        user.setProfile(userDTO.getProfile());
        return user;
    }

    public static User toEntity(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setRole(registerRequest.getRole());
        user.setProfile(registerRequest.getProfile());
        return user;
    }

    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword()); 
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setProfile(user.getProfile());
        return userDTO;
    }
}
