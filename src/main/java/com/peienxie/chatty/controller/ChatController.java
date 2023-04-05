package com.peienxie.chatty.controller;

import java.time.LocalDateTime;

import com.peienxie.chatty.model.ChatMessage;
import com.peienxie.chatty.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ChatController {

    @Autowired
    ChatService chatService;

    @MessageMapping("/chat/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        chatMessage.setUsername(headerAccessor.getSessionId());
        chatMessage.setTimestamp(LocalDateTime.now());
        log.info("chatMessage: {}", chatMessage);
        chatService.saveChatMessage(chatMessage);
        return chatMessage;
    }
}
