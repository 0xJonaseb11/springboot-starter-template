package com.jonas.template.v1.services;


import com.jonas.template.v1.dtos.request.role.CreateRoleDTO;
import com.jonas.template.v1.dtos.response.role.RoleResponseDTO;
import com.jonas.template.v1.dtos.response.role.RolesResponseDTO;
import com.jonas.template.v1.enums.ERole;
import com.jonas.template.v1.models.Role;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IRoleService {
    public Role getRoleById(UUID roleId);

    public Role getRoleByName(ERole roleName);

    public void createRole(ERole roleName);

    public RoleResponseDTO createRole(CreateRoleDTO createRoleDTO);

    public RolesResponseDTO getRoles(Pageable pageable);

    public void deleteRole(UUID roleId);

    public boolean isRolePresent(ERole roleName);
}
