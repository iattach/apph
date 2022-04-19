package com.viseo.apph.controller;

import com.viseo.apph.dto.FolderResponse;
import com.viseo.apph.dto.MessageResponse;
import com.viseo.apph.dto.ResponseDTO;
import com.viseo.apph.exception.NotFoundException;
import com.viseo.apph.service.FolderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/folder")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @ResponseBody
    @GetMapping("/{userId}")
    public ResponseEntity<ResponseDTO> getFoldersByUser(@PathVariable long userId) {
        try {
            FolderResponse folder = folderService.getFoldersByUser(userId);
            return ResponseEntity.ok(folder);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse().setMessage(e.getMessage()));
        }
    }
}
