package com.example.Bknd_User.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.example.Bknd_User.dto.UserDTO;
import com.example.Bknd_User.dto.UserUpdateRequest;
import com.example.Bknd_User.entity.User;
import com.example.Bknd_User.service.UserServices;
import com.example.Bknd_User.service.JwtService;

@Tag(name = "Usuarios", description = "Endpoints para gestión de usuarios")
@RestController
@RequestMapping(path = "api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {
    
    @Autowired
    private UserServices userService;
    
    @Autowired
    private JwtService jwtService;
    
    @Operation(
        summary = "Obtener usuario por ID",
        description = "Obtiene los datos de un usuario específico por su ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserDTO> obtenerUsuario(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable Long id) {
        User user = userService.obtenerPorId(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertirADTO(user));
    }
    
    @Operation(
        summary = "Obtener datos del usuario autenticado",
        description = "Retorna los datos del usuario actualmente autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Datos del usuario"),
        @ApiResponse(responseCode = "401", description = "Token inválido")
    })
    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserDTO> obtenerMiPerfil(
            @Parameter(hidden = true)
            @RequestHeader("Authorization") String authHeader) {
        User user = jwtService.comprobarToken(authHeader);
        return ResponseEntity.ok(convertirADTO(user));
    }
    
    @Operation(
        summary = "Actualizar usuario",
        description = "Actualiza la información de un usuario específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserDTO> actualizarUsuario(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest updateRequest,
            @Parameter(hidden = true)
            @RequestHeader("Authorization") String authHeader) {
        
        // Verificar que el usuario autenticado sea el mismo o admin
        User authUser = jwtService.comprobarToken(authHeader);
        if (!authUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        User user = userService.actualizarUsuario(id, updateRequest);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertirADTO(user));
    }
    
    @Operation(
        summary = "Eliminar usuario",
        description = "Elimina un usuario del sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> eliminarUsuario(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable Long id,
            @Parameter(hidden = true)
            @RequestHeader("Authorization") String authHeader) {
        
        // Verificar que el usuario autenticado sea el mismo o admin
        User authUser = jwtService.comprobarToken(authHeader);
        if (!authUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        boolean eliminado = userService.eliminarUsuario(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
    
    @Operation(
        summary = "Cambiar contraseña",
        description = "Permite al usuario autenticado cambiar su contraseña"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña actualizada"),
        @ApiResponse(responseCode = "400", description = "Contraseña actual incorrecta"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PostMapping("/cambiar-password")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> cambiarPassword(
            @Parameter(hidden = true)
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        User authUser = jwtService.comprobarToken(authHeader);
        boolean success = userService.cambiarPassword(authUser.getId(), request.getCurrentPassword(), request.getNewPassword());
        
        if (!success) {
            return ResponseEntity.badRequest().body("Contraseña actual incorrecta");
        }
        return ResponseEntity.ok("Contraseña actualizada exitosamente");
    }
    
    /**
     * Convierte un User a UserDTO para la respuesta
     */
    private UserDTO convertirADTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .build();
    }
    
    /**
     * DTO para cambiar contraseña
     */
    @Schema(description = "Request para cambiar contraseña")
    public static class ChangePasswordRequest {
        @Parameter(description = "Contraseña actual", required = true)
        private String currentPassword;
        
        @Parameter(description = "Nueva contraseña", required = true)
        private String newPassword;
        
        public ChangePasswordRequest() {}
        
        public ChangePasswordRequest(String currentPassword, String newPassword) {
            this.currentPassword = currentPassword;
            this.newPassword = newPassword;
        }
        
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
