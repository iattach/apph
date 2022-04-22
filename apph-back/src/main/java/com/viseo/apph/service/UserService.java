package com.viseo.apph.service;

import com.viseo.apph.dao.UserDAO;
import com.viseo.apph.domain.User;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserService {
    @Autowired
    UserDAO userDAO;
    PasswordEncoder encoder = new BCryptPasswordEncoder();

    @Transactional
    public void registerUser(String login, String password) {
        User newUser = new User().setLogin(login).setPassword(password);
        userDAO.createUser(newUser);
    }

    @Transactional
    public User login(String login, String password) throws IllegalArgumentException {
        User user = userDAO.getUserByLogin(login);
        if (encoder.matches(password, user.getPassword()))
            return user;
        throw new IllegalArgumentException();
    }

    @Transactional
    public User getUser(String login, Claims claims) {
        if (claims.get("login").equals(login))
            return userDAO.getUserByLogin(login);
        return null;
    }
}
