package com.viseo.apph.service;

import com.viseo.apph.dao.UserDAO;
import com.viseo.apph.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserService {
    @Autowired
    UserDAO userDAO;

    PasswordEncoder encoder =  new BCryptPasswordEncoder();

    @Transactional
    public void registerUser(String login, String password, String firstName, String lastName) {
        if (userDAO.userExist(login))
        {
            throw new IllegalArgumentException();
        }
      User newUser = new User().setLogin(login).setPassword(encoder.encode(password)).setFirstName(firstName).setLastName(lastName);
      userDAO.createUser(newUser);
    }

    @Transactional
    public void deleteUser(long userId){
        userDAO.deleteUser(userId);
    }

    @Transactional
    public User login(String login, String password) throws IllegalArgumentException{
        User user = userDAO.getUserByLogin(login);
        if(encoder.matches(password,user.getPassword()))
            return user;
        throw new IllegalArgumentException();
    }
}
