package com.example.Bknd_User.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.Bknd_User.entity.User;
import com.example.Bknd_User.dto.UserUpdateRequest;
import com.example.Bknd_User.repository.UserRepository;

@Service
public class UserServices {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public String intentarLogin(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Email o contraseña incorrectos"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Email o contraseña incorrectos");
        }
        
        return jwtService.generarToken(user);
    }
    
    public User obtenerPorId(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User obtenerPorEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public User registrar(String username, String email, String password) {
        // Validar ambos primero
        boolean emailExists = userRepository.existsByEmail(email);
        boolean usernameExists = userRepository.existsByUsername(username);
        
        // Construir mensaje con ambos errores si aplica
        if (emailExists && usernameExists) {
            throw new IllegalArgumentException("El email ya está registrado. El nombre de usuario ya está registrado");
        } else if (emailExists) {
            throw new IllegalArgumentException("El email ya está registrado");
        } else if (usernameExists) {
            throw new IllegalArgumentException("El nombre de usuario ya está registrado");
        }
        
        User nuevoUsuario = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .role("USER")
                .build();
        
        return userRepository.save(nuevoUsuario);
    }
    
    public User actualizarUsuario(Long id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }
        
        if (updateRequest.getUsername() != null && !updateRequest.getUsername().isBlank()) {
            String nuevoUsername = updateRequest.getUsername();

            if (!nuevoUsername.equals(user.getUsername()) && userRepository.existsByUsername(nuevoUsername)) {
                throw new IllegalArgumentException("El nombre de usuario ya está en uso");
            }

            user.setUsername(nuevoUsername);
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isBlank()) {
            String nuevoEmail = updateRequest.getEmail();

            if (!nuevoEmail.equals(user.getEmail()) && userRepository.existsByEmail(nuevoEmail)) {
                throw new IllegalArgumentException("El email ya está en uso");
            }

            user.setEmail(nuevoEmail);
        }
        
        return userRepository.save(user);
    }
    
    public boolean eliminarUsuario(Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }

        userRepository.deleteById(id);
        return true;
    }
    
    public boolean cambiarPassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return false;
        }
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return true;
    }
}