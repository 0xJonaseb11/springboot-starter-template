package com.jonas.template.v1.dtos.request.user;


import com.jonas.template.v1.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private User user;
}
