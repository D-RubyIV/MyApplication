package com.myapp.app.repository;

import com.myapp.app.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    UserModel findByEmail(String email);
    UserModel findByUsername(String username);
    UserModel findByVerificationCode(String code);
}
