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
    
    /**
     * Intenta autenticar al usuario con email y contraseña
     * @param email del usuario
     * @param password contraseña en texto plano
     * @return token JWT si la autenticación es exitosa
     * @throws BadCredentialsException si las credenciales son inválidas
     */
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
        return userRepository.findByEmail(email)
                .orElse(null);
    }
    
    public User registrar(String username, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        User nuevoUsuario = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();
        
        return userRepository.save(nuevoUsuario);
    }
    
 
    public User actualizarUsuario(Long id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        
        if (updateRequest.getUsername() != null) {
            user.setUsername(updateRequest.getUsername());
        }
        if (updateRequest.getEmail() != null) {
            // Verificar que el email no esté en uso
            if (userRepository.findByEmail(updateRequest.getEmail()).isPresent()) {
                throw new IllegalArgumentException("El email ya está en uso");
            }
            user.setEmail(updateRequest.getEmail());
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
        
        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Encriptar y guardar la nueva contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
}
