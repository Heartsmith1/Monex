package com.example.Bknd_User.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "El username es requerido")
    private String username;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser valido")
    private String email;

    @NotBlank(message = "La contrasena es requerida")
    @Size(min = 8, message = "La contrasena debe tener al menos 8 caracteres")
    private String password;
}
