package com.peienxie.chatty.service;

import java.util.ArrayList;
import java.util.List;

import com.peienxie.chatty.model.ChatMessage;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final List<ChatMessage> chatMessages = new ArrayList<>();

    public void saveChatMessage(ChatMessage chatMessage) {
        chatMessages.add(chatMessage);
    }

    public List<ChatMessage> getChatMessages() {
        return chatMessages;
    }
}
