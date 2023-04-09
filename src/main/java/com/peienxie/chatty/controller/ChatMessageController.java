package com.peienxie.chatty.controller;

import java.time.LocalDateTime;
import java.util.Map;

import com.peienxie.chatty.dto.ChatEvent;
import com.peienxie.chatty.dto.ChatEventResponse;
import com.peienxie.chatty.dto.ChatMessageRequest;
import com.peienxie.chatty.dto.ChatMessageResponse;
import com.peienxie.chatty.model.ChatMessage;
import com.peienxie.chatty.service.ChatMessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @MessageMapping("/chat/message")
    @SendTo("/topic/messages")
    public ChatMessageResponse sendMessage(@Payload ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor headerAccessor) {

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(chatMessageRequest.getContent());
        chatMessage.setSender(headerAccessor.getSessionId());
        chatMessage.setSendAt(LocalDateTime.now());

        chatMessageService.saveMessage(chatMessage);
        log.debug("Sending new message: " + chatMessage);

        ChatMessageResponse response = new ChatMessageResponse();
        response.setContent(chatMessage.getContent());
        response.setSender(chatMessage.getSender());
        response.setSendAt(chatMessage.getSendAt());

        return response;
    }

    @MessageMapping("/user/join")
    @SendTo("/topic/user")
    public ChatEventResponse joinUser(SimpMessageHeaderAccessor headerAccessor) {
//        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
//        if (sessionAttributes == null) {
//            throw new IllegalStateException("Session attributes are null");
//        }
//        log.debug("Session attributes when user join: " + sessionAttributes);
//        String username = (String) sessionAttributes.get("username");
//        if (username == null) {
//            throw new IllegalStateException("Username is not present in session attributes");
//        }
        return new ChatEventResponse(ChatEvent.USER_JOIN, headerAccessor.getSessionId());
    }

    @MessageMapping("/user/leave")
    @SendTo("/topic/user")
    public ChatEventResponse leaveUser(SimpMessageHeaderAccessor headerAccessor) {
//        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
//        if (sessionAttributes == null) {
//            throw new IllegalStateException("Session attributes are null");
//        }
//        log.debug("Session attributes when user leave: " + sessionAttributes);
//        String username = (String) sessionAttributes.get("username");
//        if (username == null) {
//            throw new IllegalStateException("Username is not present in session attributes");
//        }
        return new ChatEventResponse(ChatEvent.USER_LEAVE, headerAccessor.getSessionId());
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Exception e) {
        return "An error occurred: " + e.getMessage();
    }
}
