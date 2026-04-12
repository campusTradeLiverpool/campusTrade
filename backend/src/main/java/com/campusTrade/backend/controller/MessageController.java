package com.campusTrade.backend.controller;

import com.campusTrade.backend.model.Message;
import com.campusTrade.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> data) {
        try {
            Message message = messageService.sendMessage(data);
            return ResponseEntity.ok("Message sent");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/inbox/{email}")
    public ResponseEntity<?> getInbox(@PathVariable String email) {
        return ResponseEntity.ok(messageService.getInbox(email));
    }

    @GetMapping("/{listingId}/{email}")
    public ResponseEntity<List<Message>> getConversation(
            @PathVariable Long listingId,
            @PathVariable String email) {
        return ResponseEntity.ok(messageService.getConversation(email, listingId));
    }
}